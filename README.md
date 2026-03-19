# Project Backups

Repositório centralizado para backups automatizados dos projetos da Hextar Studio.

## 📁 Estrutura

```
project-backups/
├── eidostudio/
│   ├── frontend/
│   │   └── site-studio_backup_YYYYMMDD_HHMMSS.tar.gz
│   └── backend/
│       └── backend-site-studio_backup_YYYYMMDD_HHMMSS.tar.gz
└── [futuros projetos]
```

## 🎯 EidoStudio

**Status:** Produção ativa  
**Último backup:** 2026-03-19 16:12:16  

### Backups Disponíveis

#### Frontend (248KB)
- `site-studio_backup_20260319_161216.tar.gz`
- **Stack:** React 19, Vite, TypeScript, Tailwind CSS
- **Porta:** 8791
- **URL:** https://eidostudio.com.br

#### Backend (68KB)
- `backend-site-studio_backup_20260319_161216.tar.gz`
- **Stack:** Node.js, Express, PostgreSQL (Supabase), Stripe
- **Porta:** 8790
- **API:** https://api.eidostudio.com.br

## 📦 Como Restaurar

### Extrair Backups
```bash
# Clone o repositório
git clone git@github.com:hextarstudio-dev/project-backups.git

# Extrair frontend
cd project-backups/eidostudio/frontend
tar -xzf site-studio_backup_20260319_161216.tar.gz -C ~/Projetos/eidostudio/

# Extrair backend
cd ../backend
tar -xzf backend-site-studio_backup_20260319_161216.tar.gz -C ~/Projetos/eidostudio/
```

### Configurar e Iniciar

#### Frontend
```bash
cd ~/Projetos/eidostudio/site-studio
npm install
npm run build
pm2 start --name eidos-frontend "npx serve dist -l 8791"
```

#### Backend
```bash
cd ~/Projetos/eidostudio/backend-site-studio
npm install
# Configurar .env com credenciais (DATABASE_URL, STRIPE_SECRET_KEY, etc.)
npm start
pm2 save
```

## 🔒 Segurança

Os backups `.tar.gz` **NÃO** incluem:
- `node_modules/` (reinstalar com `npm install`)
- `dist/` (rebuild com `npm run build`)
- `.git/` (histórico de versões)
- `.env` (variáveis de ambiente - configurar manualmente)
- `.wrangler/` (temporários do Cloudflare)
- Arquivos `.bak` com secrets

## 📊 Informações do Backup

| Item | Frontend | Backend |
|------|----------|---------|
| Arquivo | site-studio_backup_20260319_161216.tar.gz | backend-site-studio_backup_20260319_161216.tar.gz |
| Tamanho | 248KB | 68KB |
| Data | 2026-03-19 16:12:16 | 2026-03-19 16:12:16 |
| Arquivos | 115 | 18 |

## 🔄 Como Adicionar Novos Backups

### Manual
```bash
# Criar backups
cd ~/Projetos/eidostudio
tar -czf site-studio_backup_$(date +%Y%m%d_%H%M%S).tar.gz \
  --exclude='node_modules' --exclude='dist' --exclude='.git' site-studio/
tar -czf backend-site-studio_backup_$(date +%Y%m%d_%H%M%S).tar.gz \
  --exclude='node_modules' --exclude='dist' --exclude='.git' backend-site-studio/

# Copiar para o repositório
cp site-studio_backup_*.tar.gz /path/to/project-backups/eidostudio/frontend/
cp backend-site-studio_backup_*.tar.gz /path/to/project-backups/eidostudio/backend/

# Commit e push
cd /path/to/project-backups
git add .
git commit -m "backup: Update EidoStudio - $(date +%Y-%m-%d)"
git push
```

### Automatizado
Veja o guia completo em [BACKUP_GUIDE.md](./BACKUP_GUIDE.md) para scripts automatizados e agendamento com cron.

## 📝 Notas Importantes

- ✅ Backups são arquivos `.tar.gz` compactados (não código extraído)
- ✅ Cada backup tem timestamp no nome do arquivo
- ✅ Múltiplas versões podem coexistir na mesma pasta
- ⚠️ Sempre configure `.env` manualmente após restauração
- ⚠️ Reconfigurar webhooks Stripe após restauração
- ⚠️ Backups de banco de dados devem ser feitos separadamente (PostgreSQL dump)

---

**Mantido por:** Hextar Studio  
**GitHub:** [@hextarstudio-dev](https://github.com/hextarstudio-dev)
