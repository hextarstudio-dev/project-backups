import Stripe from 'stripe';
import { Env } from './db';
import { getTokenPayload, unauthorizedResponse } from './tokenUtils';

const jsonResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};

export async function createCheckoutSession(request: Request, env: Env) {
  try {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Verificar autenticação
    const tokenPayload = await getTokenPayload(request);
    if (!tokenPayload) return unauthorizedResponse();

    const { priceId, userId, userEmail, productId } = await request.json() as {
      priceId: string;
      userId: string;
      userEmail: string;
      productId?: string;
    };

    if (!priceId || !userId || !userEmail || !productId) {
      return jsonResponse({ error: 'priceId, userId, userEmail, and productId are required' }, 400);
    }

    // Garantir que o userId do body bate com o do token (evita comprar no nome de outro)
    if (tokenPayload.id !== userId && tokenPayload.role !== 'admin') {
      return unauthorizedResponse('userId mismatch');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      allow_promotion_codes: true,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // expira em 30 minutos
      success_url: `https://hub.eidostudio.com.br/hub/meus-produtos?session_id={CHECKOUT_SESSION_ID}&userId=${userId}`,
      cancel_url: `https://hub.eidostudio.com.br/hub/loja`,
      customer_email: userEmail,
      metadata: {
        userId: userId,
        productId: productId,
      },
    });

    if (!session.url) {
      return jsonResponse({ error: 'Failed to create Stripe session URL' }, 500);
    }

    return jsonResponse({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('[Stripe] Checkout session error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
}

export async function handleStripeWebhook(request: Request, env: Env) {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-04-10',
    httpClient: Stripe.createFetchHttpClient(),
  });

  const signature = request.headers.get('stripe-signature');
  const body = await request.text();

  if (!signature) {
    return new Response('No stripe-signature header', { status: 400 });
  }

  try {
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log(`Payment successful for session: ${session.id}`);
        const checkoutUserId = session.metadata?.userId;
        const checkoutProductId = session.metadata?.productId;

        if (checkoutUserId && checkoutProductId) {
          try {
            // Captura o valor pago e o price_id da sessão
            const amountPaid = session.amount_total ?? 0; // em centavos
            const priceId = session.line_items?.data?.[0]?.price?.id ?? null;

            await env.DB.prepare(`
                    INSERT INTO hub_user_products (id, user_id, product_id, amount_paid, stripe_price_id)
                    VALUES (?, ?, ?, ?, ?)
                    ON CONFLICT DO NOTHING
                `).bind(
              `hup-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              checkoutUserId,
              checkoutProductId,
              amountPaid,
              priceId
            ).run();
            console.log(`Granted product ${checkoutProductId} to user ${checkoutUserId} for ${amountPaid} cents`);

            // Se comprou o pack, libera automaticamente todos os modelos inclusos + bônus (Super Briefing)
            if (checkoutProductId === 'eidos-pack' || checkoutProductId === 'prod_TxLHC5q9ckSUwI') {
              const bundleIds = [
                'prod_U27zA9t065wJaY',
                'prod_TxLD49GFquB1S2',
                'prod_TxLDxEYMFwGotV',
                'prod_TxLDri3sdXAp0H',
                'prod_TxLDL5oTDUNGTh',
                'prod_TxLDcjRlurXW1c',
                'prod_TxLDaQYotWdv1v',
                'prod_TxLD3ntDcA5JZO'
              ];
              for (const bundleId of bundleIds) {
                await env.DB.prepare(`
                    INSERT INTO hub_user_products (id, user_id, product_id, amount_paid, stripe_price_id)
                    VALUES (?, ?, ?, ?, ?)
                    ON CONFLICT DO NOTHING
                `).bind(
                  `hup-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                  checkoutUserId,
                  bundleId,
                  0,
                  null
                ).run();
              }
              console.log(`Granted full pack bundle (${bundleIds.length} itens) to user ${checkoutUserId}`);
            }
          } catch (e: any) {
            console.error('Failed to grant product', e.message);
          }
        }
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
