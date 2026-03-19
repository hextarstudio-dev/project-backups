# Log de Alterações — Backend (Eidos Studio)

Data: 2026-02-28 (UTC)
Projeto: `/home/josmarcdesign/projetos/eidostudio/backend-site-studio`

## 1) Migração de origem (Cloudflare worker -> Node/PM2)
- Código do `eidosbackendworker` copiado para `backend-site-studio`.
- Adaptação para runtime Node:
  - Criado `src/server.ts` (HTTP server para executar `fetch` handler localmente)
  - Criado `src/r2-node.ts` (adapter R2 via S3 API)
  - Ajustes em tipos/Env (`src/db.ts` e afins)
- Arquivos de execução adicionados:
  - `ecosystem.config.cjs`
  - `.env.example`
- Backend rodando em PM2:
  - app `eidos-backend`
  - porta `8790`

## 2) Infra e domínios
- `api.eidostudio.com.br` apontado para backend via Nginx.
- SSL/HTTPS configurado e funcional.
- CORS ajustado para cenários do domínio principal/hub.

## 3) Variáveis de ambiente configuradas
- `SUPABASE_URL` (pooler IPv4) configurada e validada.
- `STRIPE_SECRET_KEY` configurada.
- `STRIPE_WEBHOOK_SECRET` configurada.
- `FRONTEND_URL` configurada para `https://eidostudio.com.br` (fluxo inicial).
- `GOOGLE_REDIRECT_URI` e demais variáveis de integração preparadas.

## 4) Validação de banco e dados
- Conexão com Supabase validada.
- Endpoint de projetos validado (`/api/projects` 200).
- Limpeza de dados solicitada executada em tabelas de projetos/serviços (sem registros remanescentes).

## 5) Endpoints e resposta base
- Payload de `/` e `/api` simplificado para não expor rotas internas.
- Adicionada versão no health payload (`version: 1.0.0`).

## 6) Stripe
- Fluxo de checkout funcionando com backend em API própria.
- Ajustadas URLs de retorno para rota de hub (`/hub/...`) no fluxo atualizado.

## 7) Segurança de autenticação (backend)
- Início da migração para sessão por **cookie HttpOnly**:
  - login/registro/callback Google configurados para setar cookie `eidos_session`
  - `getTokenPayload` atualizado para aceitar token via cookie (além de Bearer para compatibilidade)
- Cookie com atributos:
  - `HttpOnly`, `Secure`, `SameSite=Lax`, `Domain=.eidostudio.com`, `Max-Age=86400`

## 8) Build e processo
- Builds executados (`npm run build`) após ajustes.
- Backend reiniciado via PM2 (`eidos-backend`) após alterações.

## 9) Nginx relacionado ao backend/hub
- `hub.eidostudio.com.br` configurado para:
  - `/api` -> backend `127.0.0.1:8790`
  - `/` -> frontend `127.0.0.1:8791`
- Objetivo: simplificar auth por cookie no mesmo host do Hub.
