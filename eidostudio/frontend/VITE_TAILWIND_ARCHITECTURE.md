# Vite + Tailwind CSS v4 Architecture Guide

## 🎯 Overview

Este documento documenta a arquitetura Vite + Tailwind CSS v4 que resolveu completamente os problemas de build e deploy para produção, sem warnings e com estilos funcionando perfeitamente.

## 🛠 Stack Completo

### Core Technologies

- **Vite 6.4.1** - Build tool ultra-rápido
- **Tailwind CSS v4.1.18** - Utility-first CSS framework
- **React 19** - UI framework
- **TypeScript 5.7.3** - Type safety

### Build Tools

- **PostCSS** - CSS processing
- **@tailwindcss/postcss** - Tailwind PostCSS plugin
- **Autoprefixer** - CSS vendor prefixes

## 📁 Estrutura de Arquivos

```
project/
├── src/
│   ├── index.tsx          # Entry point
│   ├── App.tsx             # Main app component
│   ├── components/         # React components
│   ├── pages/             # Page components
│   └── context/           # React contexts
├── index.css              # Main CSS file
├── theme.css              # Tailwind theme customizations
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
├── vite.config.ts         # Vite configuration
├── package.json           # Dependencies
└── dist/                  # Build output
```

## 🔧 Configuração Essencial

### 1. tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './context/**/*.{js,ts,jsx,tsx}',
  ],
};
```

### 2. theme.css (Cores Customizadas)

```css
@import 'tailwindcss';

@theme {
  --color-brand-primary: #f23db3;
  --color-brand-primary-light: #f564c7;
  --color-brand-primary-dark: #d42a9b;
  --color-brand-secondary: #ffffff;
  --color-brand-white: #ffffff;
  --color-brand-neutral: #1a1a1a;
  --color-brand-orange: #f25c05;
  --color-brand-lilac: #bf9bbf;

  --font-family-brand-sans: 'Inter', sans-serif;
  --font-family-brand-baloo: '"Baloo 2"', sans-serif;
}
```

### 3. index.css (Import Principal)

```css
@import 'tailwindcss';
@import './theme.css';
```

### 4. postcss.config.js

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
```

### 5. vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  envDir: '.',
  css: {
    postcss: './postcss.config.js',
  },
  define: {
    'process.env': {},
  },
  server: {
    port: 3000,
  },
});
```

### 6. index.tsx (Entry Point)

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Import CSS principal

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
```

### 7. index.html (Template)

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>App Title</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Baloo+2:wght@400;500;600;700;800&display=swap"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./index.tsx"></script>
  </body>
</html>
```

## 📦 Dependencies

### package.json

```json
{
  "dependencies": {
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "react-router-dom": "^7.11.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.1",
    "tailwindcss": "^4.1.18",
    "@tailwindcss/postcss": "^4.1.18",
    "typescript": "^5.7.3",
    "vite": "^6.0.7"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

## 🚀 Comandos Essenciais

### Setup Inicial

```bash
# 1. Criar projeto
npm create vite@latest project-name -- --template react-ts

# 2. Entrar no diretório
cd project-name

# 3. Instalar dependências
npm install

# 4. Instalar Tailwind v4
npm install -D tailwindcss postcss autoprefixer @tailwindcss/postcss

# 5. Criar arquivos de configuração
# (copiar os arquivos deste guia)
```

### Desenvolvimento

```bash
npm run dev
```

### Build para Produção

```bash
npm run build
```

### Preview do Build

```bash
npm run preview
```

## ✅ Problemas Resolvidos

### 1. Tailwind CDN Warning

**Problema:** `cdn.tailwindcss.com should not be used in production`

**Solução:**

- Usar Tailwind v4 com PostCSS
- Configurar `@tailwindcss/postcss` plugin
- Importar CSS via `@import "tailwindcss"`

### 2. CSS Não Gerado

**Problema:** Build não gera arquivo CSS

**Solução:**

- Criar `index.css` com imports corretos
- Importar CSS no `index.tsx`
- Configurar PostCSS no `vite.config.ts`

### 3. Cores Customizadas Não Funcionam

**Problema:** Classes `brand-*` não são geradas

**Solução:**

- Usar sintaxe Tailwind v4 com `@theme`
- Criar `theme.css` separado
- Definir variáveis CSS customizadas

### 4. Build Errors

**Problema:** Erros de resolve de assets

**Solução:**

- Limpar pasta `dist` antes do build
- Usar HTML simples sem referências a assets inexistentes
- Deixar Vite gerar HTML automaticamente

## 🎨 Uso de Classes Customizadas

### Cores Brand

```html
<div class="bg-brand-primary text-brand-white">
  <h1 class="text-brand-orange font-brand-baloo">Título</h1>
</div>
```

### Fontes Customizadas

```html
<p class="font-brand-sans">Texto com Inter</p>
<p class="font-brand-baloo">Texto com Baloo 2</p>
```

## 🔍 Debug e Troubleshooting

### Verificar Build

```bash
# Verificar se CSS foi gerado
ls -la dist/assets/*.css

# Verificar conteúdo do CSS
grep "brand-primary" dist/assets/*.css
```

### Verificar Tailwind

```bash
# Verificar versão
npm list tailwindcss

# Testar configuração
npx tailwindcss --help
```

### Limpar Cache

```bash
# Limpar cache Vite
rm -rf dist
rm -rf node_modules/.vite

# Limpar cache Tailwind
rm -rf .tailwindcss
```

## 📊 Performance

### Build Output Típico

```
dist/
├── assets/
│   ├── index-[hash].css    ~100KB (com Tailwind)
│   └── index-[hash].js    ~550KB (app bundle)
└── index.html              ~2KB
```

### Otimizações

- CSS: 100KB (completo com Tailwind)
- JS: 550KB (bundle otimizado)
- HTML: 2KB (mínimo)
- Total: ~650KB

## 🌓 Deploy Considerations

### Para Vercel/Netlify

- Build command: `npm run build`
- Output directory: `dist`
- Funciona out-of-the-box

### Para Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Upload `dist/*`

### Para Servidores Tradicionais

- Build command: `npm run build`
- Servir pasta `dist`
- Configurar server para arquivos estáticos

## 🔄 Workflow Recomendado

### 1. Desenvolvimento

```bash
npm run dev
# Desenvolver com hot reload
```

### 2. Teste Build

```bash
npm run build
npm run preview
# Testar localmente antes do deploy
```

### 3. Deploy

```bash
npm run build
# Upload pasta dist
```

## 📝 Notas Importantes

### Tailwind v4 vs v3

- **v4**: Usa `@import "tailwindcss"` em vez de `@tailwind directives`
- **v4**: Usa `@theme` para customizações
- **v4**: Melhor performance, menor bundle

### PostCSS

- Essencial para processar Tailwind
- Configurar com `@tailwindcss/postcss`
- Incluir autoprefixer para compatibilidade

### Vite Config

- `css.postcss` apontando para config
- `envDir` para variáveis de ambiente
- `define` para `process.env`

## 🎯 Conclusão

Esta arquitetura resolve completamente:

- ✅ Build sem warnings
- ✅ CSS funcionando em produção
- ✅ Cores customizadas ativas
- ✅ Performance otimizada
- ✅ Deploy simplificado

Use este guia como referência para novos projetos React + Vite + Tailwind CSS v4!
