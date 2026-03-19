# Log de Alterações — Frontend (Eidos Studio)

Data: 2026-02-28 (UTC)
Projeto: `/home/josmarcdesign/projetos/eidostudio/site-studio`

## 1) Estrutura e organização

- Frontend copiado de `arquivos/site-eidos-studio` para `site-studio`.
- Limpeza aplicada (itens nível amarelo):
  - Removido `site-studio/backend/`
  - Removido `site-studio/database/`
  - Removido `site-studio/scripts/welcome.js`
  - Removido `site-studio/.env.local`
- Ajuste no `package.json` para não depender mais de `scripts/welcome.js`.

## 2) Domínios e roteamento

- Site principal mantido em `eidostudio.com.br`.
- Hub migrado para subdomínio: `hub.eidostudio.com.br`.
- Rotas da área de membros alteradas de `/eidoshub/*` para `/hub/*` no fluxo principal.
- Navegação de login/registro/callback atualizada para redirecionar para `/hub/meus-produtos`.

## 3) Navbar e navegação para Hub

- Botão/link **Área de Membros** (desktop e menu mobile) alterado para abrir direto:
  - `https://hub.eidostudio.com.br/hub/meus-produtos`

## 4) Login/registro UX

- Removido botão de debug “🐛 Testar Conexão API” da página de login.

## 5) Página `/connection`

- Atualizada para contexto atual (API própria na VM):
  - fallback de API ajustado para `https://api.eidostudio.com.br`
  - textos ajustados de “Cloudflare Worker” para “API Backend”
  - mensagens de erro/status atualizadas para Nginx/PM2/API

## 6) Segurança de autenticação (frontend)

- Início da migração para sessão por **cookie HttpOnly**:
  - Removido uso de `eidos_token` no frontend.
  - Login/Register usando `credentials: 'include'`.
  - Checkout usando cookie de sessão (sem `Authorization: Bearer` local).
- Mantido em localStorage apenas:
  - `eidos_auth`
  - `eidos_auth_exp`
  - `eidos_user`
  - `eidos_saved_email` (UX)

## 7) Build e processo

- Builds executados com sucesso (`npm run build`).
- Frontend reiniciado via PM2 (`eidos-frontend`) após alterações.
