# Project Backups

Repositório centralizado para backups automatizados dos projetos da Hextar Studio.

## 📁 Estrutura

```
project-backups/
├── eidostudio/          # EidoStudio - Site & Portal
│   ├── frontend/        # React 19 + Vite
│   └── backend/         # Node.js/Express + PostgreSQL
└── [futuros projetos]
```

## 🎯 EidoStudio

**Status:** Produção ativa  
**Último backup:** 2026-03-19 16:12:16  
**Arquivos:** 133 arquivos (35,357 linhas)

### Frontend
- **Stack:** React 19, Vite, TypeScript, Tailwind CSS
- **Porta:** 8791
- **Deploy:** PM2 (eidos-frontend)
- **URL:** https://eidostudio.com.br

### Backend
- **Stack:** Node.js, Express, PostgreSQL (Supabase), Stripe
- **Porta:** 8790
- **Deploy:** PM2 (eidos-backend)
- **API:** https://api.eidostudio.com.br

## 🔒 Segurança

- ⚠️ Arquivos sensíveis não incluídos:
  - `node_modules/` (reinstalar com `npm install`)
  - `dist/` (rebuild com `npm run build`)
  - `.git/` (histórico de versões)
  - `.env` (variáveis de ambiente)
  - `.wrangler/` (temporários do Cloudflare)
  - Backups de config com secrets

## 📦 Como Restaurar

### EidoStudio Frontend
```bash
cd eidostudio/frontend
npm install
npm run build
pm2 start ecosystem.config.js --only eidos-frontend
```

### EidoStudio Backend
```bash
cd eidostudio/backend
npm install
# Configurar .env com credenciais
pm2 start ecosystem.config.js --only eidos-backend
```

## 📊 Metadados do Backup

| Projeto | Frontend | Backend | Total | Data |
|---------|----------|---------|-------|------|
| EidoStudio | 115 arquivos | 80 arquivos | 133 arquivos | 2026-03-19 |

## 🔄 Atualização

Este repositório é atualizado periodicamente via scripts automatizados ou manualmente após grandes mudanças no código.

## 📝 Notas

- Backups excluem `node_modules` e `dist` para manter o repositório leve
- Sempre configure as variáveis de ambiente antes de fazer deploy
- Para restaurar banco de dados, use dumps específicos do PostgreSQL/Supabase
- Stripe webhooks precisam ser reconfigurados após restauração

---

**Mantido por:** Hextar Studio  
**GitHub:** [@hextarstudio-dev](https://github.com/hextarstudio-dev)
