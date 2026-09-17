# MOBU MVP Setup Guide

## Step-by-Step Installation

### 1. Install Dependencies

```bash
cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu-mvp
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- React Flow Renderer (for evidence graphs)
- Recharts (for charts)

### 2. Verify Installation

```bash
# Check Node version (should be 18+)
node --version

# Check npm version
npm --version
```

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 - you should see the landing page.

### 4. Test API Endpoints

```bash
# Test recommendations API
curl http://localhost:3000/api/recommendations

# Test evidence trail API  
curl http://localhost:3000/api/evidence/rec-001

# Test portfolio API
curl http://localhost:3000/api/portfolio
```

## Next Steps to Complete MVP

### Priority 1: Dashboard Page (2-3 hours)

Create `pages/dashboard.tsx`:
- Import recommendations from API
- Display 3 recommendation cards
- Add navigation to evidence trail
- Show portfolio summary

### Priority 2: Evidence Trail Viewer (4-6 hours)

Create `pages/evidence/[id].tsx`:
- Use React Flow for graph visualization
- Show nodes and edges from API data
- Make nodes clickable (show details panel)
- Add zoom/pan controls

### Priority 3: Components (2-3 hours)

Create reusable components in `components/`:
- `RecommendationCard.tsx`
- `PortfolioSummary.tsx`
- `EvidenceGraph.tsx`
- `Navigation.tsx`

## Troubleshooting

### "Module not found" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Tailwind styles not working
```bash
# Restart dev server
# Press Ctrl+C, then run:
npm run dev
```

## Development Workflow

1. Make changes to code
2. Save file (Next.js auto-reloads)
3. Check browser for changes
4. Test in Chrome DevTools (mobile view)
5. Commit frequently to git

## Git Setup

```bash
git init
git add .
git commit -m "Initial MVP setup"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Production Deployment (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Your site will be live at: `https://mobu-mvp.vercel.app`

## Environment Variables (Production)

In Vercel dashboard, add:
- `NEXT_PUBLIC_DEMO_MODE=true`
- `NEXT_PUBLIC_API_URL=https://mobu-mvp.vercel.app/api`

## Performance Tips

- Keep JSON files small (< 1MB)
- Optimize images (use Next.js Image component)
- Lazy load heavy components
- Use React.memo for expensive renders

## Security Note

This is a **demo only**. Do not:
- Store real user data
- Use real financial data
- Deploy without authentication
- Share publicly without disclaimer

## Getting Help

- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- React Flow: https://reactflow.dev/docs
- TypeScript: https://www.typescriptlang.org/docs
