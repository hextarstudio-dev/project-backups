# Guia de Backup

## 📝 Como Fazer Backup Manual

### 1. Criar arquivos tar.gz
```bash
cd ~/Projetos/eidostudio

# Backup do frontend (exclui node_modules, dist, .git)
tar -czf site-studio_backup_$(date +%Y%m%d_%H%M%S).tar.gz \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.git' \
  site-studio/

# Backup do backend
tar -czf backend-site-studio_backup_$(date +%Y%m%d_%H%M%S).tar.gz \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.git' \
  backend-site-studio/
```

### 2. Atualizar o repositório
```bash
# Clone o repositório (primeira vez)
git clone git@github.com:hextarstudio-dev/project-backups.git /tmp/project-backups
cd /tmp/project-backups

# Extrair backups para as pastas corretas
tar -xzf ~/Projetos/eidostudio/site-studio_backup_*.tar.gz -C eidostudio/frontend/
tar -xzf ~/Projetos/eidostudio/backend-site-studio_backup_*.tar.gz -C eidostudio/backend/

# Mover conteúdo para o nível correto (remover pasta duplicada)
mv eidostudio/frontend/site-studio/* eidostudio/frontend/ && rm -rf eidostudio/frontend/site-studio
mv eidostudio/backend/backend-site-studio/* eidostudio/backend/ && rm -rf eidostudio/backend/backend-site-studio

# Remover arquivos sensíveis (caso existam)
find . -name "*.bak" -delete
rm -rf eidostudio/backend/.wrangler

# Commit e push
git add .
git commit -m "backup: Update EidoStudio - $(date +%Y-%m-%d)"
git push
```

## 🔄 Script Automatizado

Salve como `~/scripts/backup-eidostudio.sh`:

```bash
#!/bin/bash

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/tmp/project-backups"
SOURCE_DIR="$HOME/Projetos/eidostudio"

# Criar backups
cd "$SOURCE_DIR"
tar -czf "site-studio_backup_${TIMESTAMP}.tar.gz" \
  --exclude='node_modules' --exclude='dist' --exclude='.git' site-studio/
tar -czf "backend-site-studio_backup_${TIMESTAMP}.tar.gz" \
  --exclude='node_modules' --exclude='dist' --exclude='.git' backend-site-studio/

# Atualizar repositório
cd "$BACKUP_DIR" || git clone git@github.com:hextarstudio-dev/project-backups.git "$BACKUP_DIR"
cd "$BACKUP_DIR"
git pull

# Limpar pastas antigas
rm -rf eidostudio/frontend/* eidostudio/backend/*

# Extrair novos backups
tar -xzf "$SOURCE_DIR/site-studio_backup_${TIMESTAMP}.tar.gz" -C eidostudio/frontend/
tar -xzf "$SOURCE_DIR/backend-site-studio_backup_${TIMESTAMP}.tar.gz" -C eidostudio/backend/

# Reorganizar estrutura
mv eidostudio/frontend/site-studio/* eidostudio/frontend/ && rm -rf eidostudio/frontend/site-studio
mv eidostudio/backend/backend-site-studio/* eidostudio/backend/ && rm -rf eidostudio/backend/backend-site-studio

# Limpar arquivos sensíveis
find . -name "*.bak" -delete
rm -rf eidostudio/backend/.wrangler

# Commit e push
git add .
git commit -m "backup: Update EidoStudio - $(date +%Y-%m-%d %H:%M:%S)"
git push

# Limpar backups temporários
rm -f "$SOURCE_DIR"/*.tar.gz

echo "✅ Backup concluído e enviado para GitHub"
```

## ⏰ Agendar com Cron

```bash
# Editar crontab
crontab -e

# Adicionar linha (backup diário às 2h da manhã)
0 2 * * * /home/josmarcdesign/scripts/backup-eidostudio.sh >> /var/log/backup-eidostudio.log 2>&1
```

## 📋 Checklist Pré-Backup

- [ ] Verificar se há mudanças não commitadas localmente
- [ ] Garantir que `node_modules/` e `dist/` estão no .gitignore
- [ ] Remover arquivos `.bak` e `.wrangler/` antes de commitar
- [ ] Atualizar README.md com data do último backup
- [ ] Verificar que não há secrets expostos (Stripe keys, .env, etc.)

## 🚨 Emergência: Restauração Rápida

```bash
# Clone o repositório
git clone git@github.com:hextarstudio-dev/project-backups.git ~/restore-temp

# Copiar arquivos
cp -r ~/restore-temp/eidostudio/frontend ~/Projetos/eidostudio/site-studio
cp -r ~/restore-temp/eidostudio/backend ~/Projetos/eidostudio/backend-site-studio

# Reinstalar dependências
cd ~/Projetos/eidostudio/site-studio && npm install
cd ~/Projetos/eidostudio/backend-site-studio && npm install

# Configurar .env (copiar de backup seguro ou reconfigurar)
# Rebuild
npm run build

# Restart PM2
pm2 restart eidos-frontend eidos-backend
```

---

**⚠️ Importante:** Nunca commite arquivos `.env`, `wrangler.toml`, ou backups com secrets!
