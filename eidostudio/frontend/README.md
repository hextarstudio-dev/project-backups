<div align="center">
<img width="1200" height="475" alt="Eidos Studio Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Eidos Studio - Site & Hub

Site institucional e portal exclusivo para clientes da Eidos Studio, agência de design gráfico.

## 🎯 Visão Geral

Este projeto consiste em duas partes principais:

- **Site Público**: Portfolio institucional com serviços, projetos e informações de contato
- **Eidos Hub**: Portal privado para clientes acessarem cursos, downloads e comunidade

## 🛠 Tecnologias

### Frontend (Produção)

- **React 19** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS v4** (estilos)
- **React Router** (rotas)
- **Lucide Icons** (ícones)

### Backend (Cloudflare)

- **Cloudflare Workers** (serverless)
- **Supabase** (PostgreSQL database)
- **Cloudflare R2** (storage)
- **Cloudflare Pages** (hosting)

### Infraestrutura

- **Custom Domains**: eidostudio.com.br, api.eidostudio.com.br
- **CDN**: Cloudflare
- **Pagamentos**: Stripe
- **Storage**: R2 com cdn.eidostudio.com.br

## 🌐 URLs de Produção

- **Frontend**: https://eidostudio.com.br
- **API**: https://api.eidostudio.com.br
- **CDN**: https://cdn.eidostudio.com.br
- **Storage**: https://api.eidostudio.com.br/api/storage

## 🚀 Setup Local

**Pré-requisitos:**

- Node.js 18+
- npm ou yarn

1. **Instalar dependências:**

   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente:**

   ```bash
   # Copiar arquivo de exemplo
   cp backend/.env.example backend/.env

   # Editar backend/.env com suas chaves:
   - GEMINI_API_KEY (Google Gemini)
   - R2_* (Cloudflare R2 storage)
   - CLOUDFLARE_API_TOKEN
   ```

3. **Executar migrações e seeds:**

   ```bash
   npm run migrate
   npm run seed
   npm run seed:hub
   ```

4. **Iniciar aplicação:**

   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3002

## 📁 Estrutura do Projeto

```
site-eidos-studio/
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/         # Páginas do site
│   │   ├── pages/eidoshub/ # Portal do cliente
│   │   ├── context/       # React Context
│   │   └── App.tsx        # App principal com rotas
│   ├── public/
│   └── index.html
├── backend/
│   ├── index.js           # API server
│   ├── storage.js         # Config R2/S3
│   ├── migrate*.js        # Migrações DB
│   ├── seed*.js          # Dados iniciais
│   └── .env              # Variáveis ambiente
├── database/
│   ├── database.sqlite   # Database SQLite
│   ├── schema.sql        # Estrutura das tabelas
│   └── seed.sql          # Dados iniciais
└── scripts/
    └── welcome.js        # Script de boas-vindas
```

## 🎨 Seções do Site

### Páginas Públicas

- **Home** (`/`) - Hero section e apresentação
- **Sobre** (`/sobre`) - Informações sobre a agência
- **Portfolio** (`/portfolio`) - Galeria de projetos com modal
- **Serviços** (`/servicos`) - Lista de serviços
- **Contato** (`/contato`) - Formulário de contato

### Portal do Cliente (Eidos Hub)

- **Início** (`/eidoshub`) - Dashboard principal
- **Produtos** (`/eidoshub/meus-produtos`) - Cursos comprados
- **Loja** (`/eidoshub/loja`) - Compra de novos produtos
- **Comunidade** (`/eidoshub/comunidade`) - Fórum/discussões
- **Suporte** (`/eidoshub/suporte`) - Ajuda e FAQ
- **Perfil** (`/eidoshub/perfil`) - Dados do usuário

### Administração

- **Admin** (`/admin`) - Painel administrativo
- **Login** (`/login`) - Autenticação

## 🗄️ Database

### Tabelas Principais (Supabase PostgreSQL)

- **users** - Usuários do sistema
- **hub_users** - Perfil extendido no portal
- **projects** - Projetos do portfolio
- **project_sections** - Seções dos projetos
- **project_images** - Imagens das galerias
- **services** - Serviços da agência
- **categories** - Categorias dos projetos
- **hub_products** - Produtos/cursos
- **hub_lessons** - Aulas dos produtos
- **hub_comments** - Comentários em aulas

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia frontend (Vite)

# Build
npm run build            # Build para produção
npm run preview          # Preview do build
```

## ☁️ Storage

O projeto utiliza **Cloudflare R2** para armazenamento de arquivos:

- **Portfolio**: Imagens dos projetos
- **Serviços**: Imagens dos serviços
- **Hub**: Avatares, downloads e vídeos
- **Assets**: Logos e ícones

URL pública: `https://cdn.eidostudio.com.br`

## 🔐 Segurança

- Upload restrito a pastas específicas
- Sanitização de nomes de arquivos
- Validação de tipos MIME
- CORS configurado
- FKs com CASCADE DELETE

## 🚀 Deploy

O projeto está configurado para deploy em plataformas como:

- **Vercel** (frontend)
- **Cloudflare Workers** (backend)
- **Cloudflare Pages** (estático)

## 📝 Licença

Projeto proprietário da Eidos Studio.
