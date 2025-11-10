# 🚀 Quick Deployment Instructions for Vending Machine Demo

## Deploy to Vercel (Fastest)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Navigate to the demo directory
cd vending-machine-demo

# 3. Deploy
vercel --prod
```

## Or use the Vercel Dashboard

1. Go to https://vercel.com/new
2. Import the repository
3. Set root directory to: `vending-machine-demo`
4. Click Deploy

The site will be live at: `https://[project-name].vercel.app`

## Update README after deployment

After deployment, update the live demo link in:
- `/README.md` (line ~11)
- `/vending-machine-demo/README.md` (line ~4)

Replace `https://codex-vending-machine.vercel.app` with your actual deployment URL.

---

For detailed deployment options (Netlify, GitHub Pages, etc.), see:
`vending-machine-demo/DEPLOYMENT.md`
