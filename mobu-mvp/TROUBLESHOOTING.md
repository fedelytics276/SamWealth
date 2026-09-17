# Troubleshooting Guide

## ✅ Issue Fixed: Missing lucide-react Package

**Error**: `Cannot find module 'lucide-react'`

**Solution**: Already fixed! The package has been installed.

## How to Start the Development Server

```bash
cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth/mobu-mvp
npm run dev
```

Open http://localhost:3000 in your browser.

## Common Issues & Solutions

### 1. "Module not found" Errors

**Solution**:
```bash
# Reinstall all dependencies
npm install

# If that doesn't work, clean install
rm -rf node_modules package-lock.json
npm install
```

### 2. Port 3000 Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Option 1: Kill the process
lsof -ti:3000 | xargs kill -9

# Option 2: Use a different port
PORT=3001 npm run dev
```

### 3. TypeScript Errors

**Check for errors**:
```bash
npx tsc --noEmit
```

**Common fixes**:
- Missing type definitions: `npm install @types/[package-name]`
- Outdated TypeScript: `npm install typescript@latest`

### 4. Tailwind Styles Not Working

**Solution**:
```bash
# Restart the dev server
# Press Ctrl+C to stop, then:
npm run dev
```

### 5. Build Fails

**Test the build**:
```bash
npm run build
```

**If it fails**:
1. Check for TypeScript errors: `npx tsc --noEmit`
2. Check for ESLint errors: `npm run lint`
3. Clear Next.js cache: `rm -rf .next`

### 6. API Routes Not Working

**Test APIs**:
```bash
# Make sure dev server is running, then in another terminal:
curl http://localhost:3000/api/recommendations
curl http://localhost:3000/api/evidence/rec-001
curl http://localhost:3000/api/portfolio
```

**Expected response**: JSON with `success: true`

### 7. "Cannot find module '@/...'"

**Error**: Path alias not working

**Solution**: Already configured in `tsconfig.json`. If still issues:
```bash
# Restart TypeScript server in VS Code
# Cmd+Shift+P > TypeScript: Restart TS Server
```

## Verification Checklist

After fixing issues, verify everything works:

- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts successfully
- [ ] http://localhost:3000 loads the landing page
- [ ] `npm run build` completes successfully
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] API endpoints respond: `curl http://localhost:3000/api/recommendations`

## Current Status

✅ **All dependencies installed**  
✅ **TypeScript compiles without errors**  
✅ **Build succeeds**  
✅ **Ready for development**

## Next Steps

1. Start the dev server: `npm run dev`
2. Open http://localhost:3000
3. You should see the landing page
4. Click "See Demo" - it will show 404 (because dashboard.tsx doesn't exist yet)
5. Build the dashboard page next (see PROJECT_STATUS.md)

## Getting Help

If you're still stuck:

1. Check the error message carefully
2. Look in `PROJECT_STATUS.md` for what needs to be built
3. Refer to `SETUP.md` for detailed instructions
4. Check Next.js docs: https://nextjs.org/docs

## Clean Slate (Nuclear Option)

If nothing works, start fresh:

```bash
cd /Users/fedeanalytics/Documents/Sectors_solution/SamWealth
rm -rf mobu-mvp
# Re-create the project from scratch
```

But you shouldn't need this - the project is working! ✅
