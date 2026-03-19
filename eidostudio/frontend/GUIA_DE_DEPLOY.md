# Documentação de Deploy - Eidos Studio

Este documento serve como guia de referência rápida para o processo de build e deploy da plataforma Eidos Hub.
Toda a nossa infraestrutura está rodando no ecossistema da **Cloudflare** (Cloudflare Pages para o site em React, e Cloudflare Workers para nossa API em Node/TypeScript).

---

## 🚀 1. Deploy do Site (Frontend - Eidos Hub Pages)

Nosso Frontend é construído em React com Vite + TailwindCSS. Ele é hospedado utilizando o **Cloudflare Pages**.

### Passo a Passo de Publição (Deploy Local para Produção)

Sempre que fizer uma alteração em qualquer arquivo na pasta do site (`pages`, `components`, `App.tsx`, etc), execute esse comando no terminal raiz do projeto (`site-eidos-studio`):

```bash
npm run build && npx wrangler pages deploy dist --project-name eidostudiocloudflare
```

**O que este comando faz:**

1. `npm run build`: Vai rodar o TypeScript e o Vite para compilar o site e gerar os arquivos estáticos de produção na pasta `/dist`.
2. `npx wrangler pages deploy dist`: Pega o conteúdo da pasta `/dist` compilada e faz o upload direto para o nosso projeto `eidostudiocloudflare` na rede da Cloudflare.

**Preview URL:** Se quiser hospedar em um ambiente de preview sem afetar a produção oficial de imediato, remova ou não especifique a branch de production, mas por enquanto nosso comando já manda direto pro site no ar.

---

## ⚙️ 2. Deploy da API (Backend - Cloudflare Worker)

Nossa API e o banco de dados funcionam em Serverless pelo **Cloudflare Workers**. Todo esse código está contido dentro da pasta `/eidosbackendworker`.

### Passo a Passo de Publicação

Quando editar rotas, lógica de banco de dados (`db.ts`), integração com Stripe (`stripeHandlers.ts`) ou login (`authHandlers.ts`), siga os passos no terminal:

```bash
# Entrar na pasta do worker primeiro (caso esteja na raiz do site)
cd eidosbackendworker

# Fazer o deploy do código para a nuvem
npx wrangler deploy
# ou apenas `npm run deploy` caso tenha configurado no package.json.
```

**O que este comando faz:**
O script do wrangler lê o `wrangler.toml` onde as configurações do banco D1, do R2 e as variáveis do ambiente estão "linkadas" ao nosso worker com nome `eidosbackendworker`. Depois, sobe a nova versão rodando na hora.

---

## 🔒 Variáveis de Ambiente e Segredos (Wrangler Secrets)

Nunca enviamos chaves de API cruas nos arquivos de código! Usamos os _Secrets_ do ambiente Cloudflare.
Se precisar atualizar um Token (Google Client ID, Stripe Secret Key, Endpoint Secrets), **não** é necessário fazer deploy do código, mas é preciso atualizar no servidor usando a CLI na pasta do Worker:

```bash
cd eidosbackendworker
npx wrangler secret put NOME_DA_VARIAVEL_AQUI
# O console vai pedir para você colar a chave e dar Enter.
```

No caso de problemas com aspas extras usando terminais no Windows, temos o script `put_secrets.js` para contornar e subir várias variáveis formatadas limpas. Você o executa assim dentro do diretório do Worker: `node put_secrets.js`

---

## 🗄️ Manutenção Rápida do Banco de Dados D1

Se precisar alterar tabelas locais na nuvem, lembrete que o comando do Wrangler costuma ser:

```bash
cd eidosbackendworker
# Rodar comandos diretamente no banco pelo wrangler:
npx wrangler d1 execute eidos_db --remote --command="Sua Query SQL Aqui..."
```
