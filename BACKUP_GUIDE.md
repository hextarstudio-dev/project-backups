# Guia de Backup

## 📝 Como Fazer Backup Manual

### 1. Criar arquivos tar.gz
```bash
cd ~/Projetos/eidostudio
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Backup do frontend (exclui node_modules, dist, .git)
tar -czf "site-studio_backup_${TIMESTAMP}.tar.gz" \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.git' \
  site-studio/

# Backup do backend
tar -czf "backend-site-studio_backup_${TIMESTAMP}.tar.gz" \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.git' \
  backend-site-studio/
```

### 2. Copiar para o repositório
```bash
# Clone o repositório (primeira vez)
git clone git@github.com:hextarstudio-dev/project-backups.git ~/repos/project-backups
cd ~/repos/project-backups

# Copiar os .tar.gz
cp ~/Projetos/eidostudio/site-studio_backup_*.tar.gz eidostudio/frontend/
cp ~/Projetos/eidostudio/backend-site-studio_backup_*.tar.gz eidostudio/backend/

# Commit e push
git add .
git commit -m "backup: Update EidoStudio - $(date +%Y-%m-%d)"
git push

# Limpar backups temporários
rm -f ~/Projetos/eidostudio/*.tar.gz
```

## 🔄 Script Automatizado

Salve como `~/scripts/backup-eidostudio.sh`:

```bash
#!/bin/bash

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_REPO="$HOME/repos/project-backups"
SOURCE_DIR="$HOME/Projetos/eidostudio"

# Criar backups
cd "$SOURCE_DIR" || exit 1

echo "📦 Criando backups..."
tar -czf "site-studio_backup_${TIMESTAMP}.tar.gz" \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.git' \
  site-studio/

tar -czf "backend-site-studio_backup_${TIMESTAMP}.tar.gz" \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.git' \
  backend-site-studio/

# Verificar se repo existe, senão clonar
if [ ! -d "$BACKUP_REPO" ]; then
  echo "📥 Clonando repositório..."
  git clone git@github.com:hextarstudio-dev/project-backups.git "$BACKUP_REPO"
fi

# Atualizar repositório
cd "$BACKUP_REPO" || exit 1
git pull

# Copiar novos backups
echo "📂 Copiando backups para repositório..."
cp "$SOURCE_DIR/site-studio_backup_${TIMESTAMP}.tar.gz" eidostudio/frontend/
cp "$SOURCE_DIR/backend-site-studio_backup_${TIMESTAMP}.tar.gz" eidostudio/backend/

# Commit e push
echo "☁️  Enviando para GitHub..."
git add .
git commit -m "backup: Update EidoStudio - $(date +%Y-%m-%d %H:%M:%S)"
git push

# Limpar backups temporários
echo "🧹 Limpando arquivos temporários..."
rm -f "$SOURCE_DIR"/*.tar.gz

# Manter apenas os 3 backups mais recentes de cada tipo
cd "$BACKUP_REPO/eidostudio/frontend"
ls -t site-studio_backup_*.tar.gz | tail -n +4 | xargs -r rm

cd "$BACKUP_REPO/eidostudio/backend"
ls -t backend-site-studio_backup_*.tar.gz | tail -n +4 | xargs -r rm

# Commit remoção de backups antigos
cd "$BACKUP_REPO"
if [[ -n $(git status -s) ]]; then
  git add .
  git commit -m "backup: Remove old backups (keep last 3)"
  git push
fi

echo "✅ Backup concluído e enviado para GitHub!"
echo "📊 Tamanho dos backups:"
du -sh "$BACKUP_REPO/eidostudio/frontend"/*.tar.gz "$BACKUP_REPO/eidostudio/backend"/*.tar.gz
```

Tornar executável:
```bash
chmod +x ~/scripts/backup-eidostudio.sh
```

## ⏰ Agendar com Cron

```bash
# Criar diretório de scripts
mkdir -p ~/scripts

# Copiar script
# (depois de criar o arquivo acima)

# Editar crontab
crontab -e

# Adicionar linha (backup diário às 2h da manhã)
0 2 * * * /home/josmarcdesign/scripts/backup-eidostudio.sh >> /var/log/backup-eidostudio.log 2>&1

# Ou semanal (domingo às 3h)
0 3 * * 0 /home/josmarcdesign/scripts/backup-eidostudio.sh >> /var/log/backup-eidostudio.log 2>&1
```

Criar arquivo de log:
```bash
sudo touch /var/log/backup-eidostudio.log
sudo chown josmarcdesign:josmarcdesign /var/log/backup-eidostudio.log
```

## 📋 Checklist Pré-Backup

- [ ] Verificar se há mudanças críticas não commitadas no projeto principal
- [ ] Testar que aplicação está funcionando corretamente
- [ ] Confirmar que `.env` está seguro (não incluído no backup)
- [ ] Espaço em disco suficiente (mínimo 500MB livre)
- [ ] Conexão SSH com GitHub configurada

## 🚨 Emergência: Restauração Rápida

### Restaurar de Backup
```bash
# Clone o repositório
git clone git@github.com:hextarstudio-dev/project-backups.git ~/restore-temp

# Extrair frontend
cd ~/restore-temp/eidostudio/frontend
tar -xzf site-studio_backup_*.tar.gz -C ~/Projetos/eidostudio/

# Extrair backend
cd ../backend
tar -xzf backend-site-studio_backup_*.tar.gz -C ~/Projetos/eidostudio/
```

### Reconfigurar Ambiente
```bash
# Frontend
cd ~/Projetos/eidostudio/site-studio
npm install
npm run build

# Backend
cd ~/Projetos/eidostudio/backend-site-studio
npm install

# Configurar .env manualmente (copiar de backup seguro)
nano .env  # ou vim .env
```

### Reiniciar Serviços
```bash
# Parar serviços antigos
pm2 stop eidos-frontend eidos-backend

# Iniciar com novos arquivos
cd ~/Projetos/eidostudio/site-studio
pm2 start ecosystem.config.js --only eidos-frontend

cd ~/Projetos/eidostudio/backend-site-studio
pm2 start ecosystem.config.js --only eidos-backend

# Salvar configuração PM2
pm2 save
```

## 📊 Verificar Status dos Backups

```bash
cd ~/repos/project-backups

# Listar backups disponíveis
echo "=== Frontend Backups ==="
ls -lh eidostudio/frontend/*.tar.gz
echo ""
echo "=== Backend Backups ==="
ls -lh eidostudio/backend/*.tar.gz

# Ver histórico de commits
git log --oneline -10

# Tamanho total
du -sh eidostudio/
```

## 🔧 Manutenção

### Limpar Backups Antigos
```bash
cd ~/repos/project-backups

# Manter apenas os 3 mais recentes (frontend)
cd eidostudio/frontend
ls -t site-studio_backup_*.tar.gz | tail -n +4 | xargs rm

# Manter apenas os 3 mais recentes (backend)
cd ../backend
ls -t backend-site-studio_backup_*.tar.gz | tail -n +4 | xargs rm

# Commit remoção
cd ../..
git add .
git commit -m "backup: Clean old backups"
git push
```

### Testar Integridade do Backup
```bash
# Testar se .tar.gz não está corrompido
tar -tzf site-studio_backup_20260319_161216.tar.gz > /dev/null && echo "✅ OK" || echo "❌ Corrupted"

# Extrair em pasta temporária para teste
mkdir -p /tmp/backup-test
tar -xzf site-studio_backup_*.tar.gz -C /tmp/backup-test
ls -la /tmp/backup-test
rm -rf /tmp/backup-test
```

---

**⚠️ Lembrete:** 
- Backups `.tar.gz` salvam apenas código-fonte
- Banco de dados precisa de backup separado (pg_dump)
- Arquivos `.env` devem ser guardados em local seguro (não no Git!)
- Testar restauração periodicamente
