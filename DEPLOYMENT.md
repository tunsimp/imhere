# GitHub Pages Deployment Guide

## Prerequisites

1. Make sure you have a GitHub repository named `imhere`
2. Make sure `gh-pages` is installed (it's already in your package.json)

## Deployment Steps

### Option 1: Using npm scripts (Recommended)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```

   This will:
   - Build your project (`predeploy` script runs automatically)
   - Deploy the `dist` folder to the `gh-pages` branch
   - Make your site available at `https://tunsimp.github.io/imhere/`

### Option 2: Manual deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Install gh-pages globally (if not already installed):**
   ```bash
   npm install -g gh-pages
   ```

3. **Deploy:**
   ```bash
   gh-pages -d dist
   ```

## Important Notes

1. **Base Path**: The `vite.config.ts` has been configured with `base: '/imhere/'` to match your repository name. If your repository has a different name, update this value.

2. **GitHub Pages Settings**: 
   - Go to your repository on GitHub
   - Click Settings → Pages
   - Make sure the source is set to `gh-pages` branch (or the branch you're deploying to)
   - The site will be available at `https://tunsimp.github.io/imhere/`

3. **First Time Setup**:
   - Make sure you're logged into GitHub CLI or have SSH keys configured
   - The first deployment might ask for authentication

4. **Troubleshooting**:
   - If assets don't load, check that the `base` path in `vite.config.ts` matches your repository name
   - Make sure all files are committed to git before deploying
   - Check the GitHub Pages settings in your repository

## After Deployment

Your app will be available at: `https://tunsimp.github.io/imhere/`

Note: It may take a few minutes for the site to be available after the first deployment.

