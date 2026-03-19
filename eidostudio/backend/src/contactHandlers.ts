import { Env } from './db';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  service: string;
}

// Helper para enviar email via MailChannels (built-in no Cloudflare Workers)
async function sendEmail(to: string, subject: string, html: string, from: string = 'contato@eidostudio.com.br') {
  const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: to }],
        },
      ],
      from: {
        email: from,
        name: 'Eidos Studio',
      },
      subject: subject,
      content: [
        {
          type: 'text/html',
          value: html,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send email: ${response.statusText}`);
  }

  return response;
}

export async function handleContactForm(request: Request, env: Env): Promise<Response> {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, phone, message, service } = body;

    // Validação básica
    if (!name || !email || !message || !service) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Campos obrigatórios faltando: name, email, message, service',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Mapeamento de serviços
    const serviceLabels: Record<string, string> = {
      branding: 'Identidade Visual & Branding',
      social: 'Social Media',
      video: 'Edição de Vídeos',
      web: 'Web Design',
      outro: 'Outro Projeto',
    };

    const serviceLabel = serviceLabels[service] || service;

    // Email para você (admin)
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f23db3 0%, #f25c05 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Novo Briefing Recebido</h1>
        </div>

        <div style="padding: 30px; background: #f9f9f9;">
          <div style="background: white; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #333; border-bottom: 2px solid #f23db3; padding-bottom: 10px;">Informações do Cliente</h2>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p><strong>WhatsApp:</strong> <a href="https://wa.me/${phone.replace(/\D/g, '')}">${phone}</a></p>` : ''}
            <p><strong>Serviço:</strong> ${serviceLabel}</p>
          </div>

          <div style="background: white; padding: 25px; border-radius: 10px;">
            <h2 style="color: #333; border-bottom: 2px solid #f23db3; padding-bottom: 10px;">Sobre o Projeto</h2>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>

          <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 5px;">
            <p style="margin: 0; color: #856404;">
              <strong>⏰ Próximos Passos:</strong> Retornar em até 24 horas úteis com proposta inicial.
            </p>
          </div>
        </div>

        <div style="background: #333; padding: 20px; text-align: center; color: #999; font-size: 12px;">
          <p>Eidos Studio - Design que organiza percepção, valor e direção</p>
          <p>© ${new Date().getFullYear()} Todos os direitos reservados</p>
        </div>
      </div>
    `;

    // Email de confirmação para o cliente
    const clientHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f23db3 0%, #f25c05 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Briefing Recebido!</h1>
        </div>

        <div style="padding: 30px; background: #f9f9f9;">
          <div style="background: white; padding: 25px; border-radius: 10px;">
            <p>Olá, <strong>${name}</strong>!</p>

            <p>Recebemos seu briefing para <strong>${serviceLabel}</strong> e já estamos analisando os detalhes do seu projeto.</p>

            <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #f23db3;">O que acontece agora?</h3>
              <ol style="margin: 0; padding-left: 20px;">
                <li>Nossa equipe vai analisar seu briefing</li>
                <li>Vamos estruturar uma proposta inicial</li>
                <li>Retornamos em <strong>até 24 horas úteis</strong></li>
              </ol>
            </div>

            <p>Enquanto isso, se tiver alguma dúvida, pode responder este email ou nos chamar no WhatsApp.</p>

            <div style="text-align: center; margin-top: 30px;">
              <a href="https://wa.me/5511999999999"
                 style="display: inline-block; background: #25D366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                💬 Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div style="background: #333; padding: 20px; text-align: center; color: #999; font-size: 12px;">
          <p>Eidos Studio - Design que organiza percepção, valor e direção</p>
          <p><a href="https://eidostudio.com.br" style="color: #f23db3;">eidostudio.com.br</a></p>
        </div>
      </div>
    `;

    // Enviar emails
    await sendEmail(
      'contato@eidostudio.com.br',
      `[BRIEFING] Novo contato de ${name} - ${serviceLabel}`,
      adminHtml
    );

    await sendEmail(
      email,
      'Recebemos seu briefing! - Eidos Studio',
      clientHtml
    );

    return new Response(JSON.stringify({
      success: true,
      message: 'Briefing recebido com sucesso! Retornaremos em breve.',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Erro ao processar solicitação. Tente novamente ou entre em contato direto.',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
