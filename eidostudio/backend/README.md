# Eidos Studio Backend - Cloudflare Worker

Backend serverless completo para o Eidos Studio, rodando na Cloudflare Workers conectado ao Supabase PostgreSQL e ao R2 Storage.

## 🎯 Arquitetura

- **Cloudflare Workers**: Serverless functions
- **Supabase PostgreSQL**: Banco de dados relacional (via pool com driver `node-postgres`)
- **R2 Storage**: Armazenamento de arquivos
- **Stripe**: Processamento de pagamentos
- **Custom Domain**: api.eidostudio.com.br

## 🛠 Tecnologias

- **TypeScript**: Tipagem forte
- **Supabase**: PostgreSQL gerenciado
- **Cloudflare R2**: Object storage
- **Stripe API**: Pagamentos
- **JWT**: Autenticação

## 🌐 URLs

- **API**: https://api.eidostudio.com.br
- **Endpoints**: `/api/projects`, `/api/services`, `/api/categories`
- **Storage**: `/api/storage`, `/api/setup-storage`
- **Stripe**: `/api/stripe/create-checkout`, `/api/stripe/webhook`

## 🚀 Deploy

```bash
# Deploy do Worker
npx wrangler deploy

# Verificar status
npx wrangler deployments list
```

### Instalação de Bibliotecas e Configuração do pg Node.js

Para a biblioteca `pg` (node-postgres) funcionar na Edge do Cloudflare, estamos usando a flag de compilação `nodejs_compat`.

```toml
# Em wrangler.toml
compatibility_date = "2024-09-23"
compatibility_flags = [ "nodejs_compat" ]
```

### Configure Secrets (Stripe e Supabase)

O worker se conecta ao Postgres e faz transações com a Stripe via variáveis de ambiente seguras. Use os seguintes comandos no terminal:

```bash
# URL de Conexão do seu Supabase
wrangler secret put SUPABASE_URL

# Configurações do Stripe
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_WEBHOOK_SECRET

# The base URL of your frontend application
wrangler secret put FRONTEND_URL
```

## 3. Local Development

To run the worker locally for testing, use the `dev` script. This will start a local server that simulates the Cloudflare environment and connects to your local D1 database.

```bash
npm run dev
```

The worker will be available at `http://localhost:8787`.

## 4. Deployment

To deploy the worker to your Cloudflare account, use the `deploy` script.

```bash
npm run deploy
```

Wrangler will build and upload your worker. After deployment, it will be accessible at the URL provided in the output (e.g., `https://eidos-backend-worker.<your-subdomain>.workers.dev`).

## API Endpoints

Once deployed, the following endpoints will be available:

- `/api/projects`
- `/api/services`
- `/api/categories`
