# Deployment Guide

## Deploy to Vercel (Recommended)

### Option 1: Via Vercel CLI (Fastest)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Navigate to the vending-machine-demo directory:
```bash
cd vending-machine-demo
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **codex-vending-machine** (or your preferred name)
   - In which directory is your code located? **./**
   - Override settings? **N**

5. For production deployment:
```bash
vercel --prod
```

### Option 2: Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the Vite configuration
5. Set the following:
   - **Framework Preset**: Vite
   - **Root Directory**: `vending-machine-demo`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click "Deploy"

Your site will be live at `https://[your-project-name].vercel.app`

## Deploy to Netlify

### Via Netlify CLI

1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Navigate to the vending-machine-demo directory:
```bash
cd vending-machine-demo
```

3. Build the project:
```bash
npm run build
```

4. Deploy:
```bash
netlify deploy --prod --dir=dist
```

### Via Netlify Dashboard

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to your GitHub repository
4. Set the following:
   - **Base directory**: `vending-machine-demo`
   - **Build command**: `npm run build`
   - **Publish directory**: `vending-machine-demo/dist`
5. Click "Deploy site"

## Deploy to GitHub Pages

1. Update `vite.config.ts` to set the base path:
```ts
export default defineConfig({
  plugins: [react()],
  base: '/codex/' // or your repo name
})
```

2. Build the project:
```bash
npm run build
```

3. Deploy using gh-pages:
```bash
npm i -g gh-pages
gh-pages -d dist
```

## Environment Variables

This demo doesn't require any environment variables. All data is mocked locally.

## Custom Domain

After deploying to Vercel or Netlify, you can add a custom domain:

### Vercel
1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain

### Netlify
1. Go to your site settings
2. Navigate to "Domain management"
3. Add your custom domain

## Troubleshooting

### Build fails
- Ensure Node.js version is 18 or higher
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

### Assets not loading
- Check the base path in vite.config.ts
- Ensure all imports use relative paths

### Deployment preview works but production fails
- Check build logs for errors
- Verify environment variables are set correctly
- Ensure all dependencies are in package.json (not just devDependencies)
