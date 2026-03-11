# Quick Deployment Guide

## Deploy to Vercel in 3 Steps

### Step 1: Prepare the Project
```bash
# Extract the ZIP file
unzip rubberkicks-pos.zip
cd rubberkicks-pos

# Install dependencies (optional, Vercel will do this)
npm install
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Easiest)
1. Go to https://vercel.com/new
2. Sign in with GitHub, GitLab, or Bitbucket
3. Click "Deploy" or drag and drop the project folder
4. Vercel auto-detects Next.js and deploys
5. Your app will be live in ~2 minutes!

#### Option B: Using Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? [Select your account]
# - Link to existing project? N
# - Project name? rubberkicks-pos
# - Directory? ./
# - Override settings? N

# Production deployment
vercel --prod
```

#### Option C: Deploy from GitHub
```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/rubberkicks-pos.git
git push -u origin main

# Then import from Vercel Dashboard
# https://vercel.com/new
```

### Step 3: Access Your App
After deployment, Vercel provides:
- A live URL (e.g., `rubberkicks-pos.vercel.app`)
- Automatic HTTPS
- Global CDN
- Continuous deployment on push

## Optional: Add Vercel KV Storage

For production-grade persistent storage:

1. In Vercel Dashboard → Your Project → Storage
2. Click "Create Database" → Choose "KV"
3. Create database
4. Environment variables are auto-added
5. Redeploy (automatic)

The app automatically uses KV when available, otherwise uses file storage.

## Testing Locally

```bash
# Development mode
npm run dev

# Build and test production
npm run build
npm start
```

## Environment Variables

No environment variables are required for basic deployment!

Optional (for Vercel KV):
- KV_URL
- KV_REST_API_URL
- KV_REST_API_TOKEN
- KV_REST_API_READ_ONLY_TOKEN

These are automatically added when you create a KV database.

## Troubleshooting

### Build fails?
- Check Node.js version (need 18+)
- Run `npm install` locally first
- Check build logs in Vercel dashboard

### Data not persisting?
- Add Vercel KV database (see above)
- Or use file storage (works but resets on each deployment)

### Need help?
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- This project uses Next.js 14 App Router

## URLs After Deployment

- Production: `https://your-project.vercel.app`
- Preview: Auto-generated for each push
- Dashboard: https://vercel.com/dashboard

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS (Vercel provides instructions)
4. SSL certificate auto-generated

---

That's it! Your POS system is now live and accessible worldwide! 🚀
