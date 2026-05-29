# Deployment Guide

This document covers how to deploy WriteSpace to production. WriteSpace is a fully client-side React single-page application (SPA) with no backend or environment variables required — making deployment straightforward on any static hosting platform.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build](#build)
- [Vercel Deployment](#vercel-deployment)
  - [Automatic Deploys from Git](#automatic-deploys-from-git)
  - [Manual Deployment via Vercel CLI](#manual-deployment-via-vercel-cli)
  - [SPA Rewrite Configuration](#spa-rewrite-configuration)
- [Environment Considerations](#environment-considerations)
- [CI/CD Notes](#cicd-notes)
- [Other Hosting Platforms](#other-hosting-platforms)
  - [Netlify](#netlify)
  - [GitHub Pages](#github-pages)
  - [Cloudflare Pages](#cloudflare-pages)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- npm (included with Node.js)
- A Git repository hosted on GitHub, GitLab, or Bitbucket (for automatic deploys)

---

## Build

To create a production-ready build, run:

```bash
npm install
npm run build
```

This executes `vite build`, which outputs optimized static files to the `dist/` directory:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── favicon.ico
```

You can preview the production build locally before deploying:

```bash
npm run preview
```

This starts a local server (typically at `http://localhost:4173`) serving the `dist/` directory.

---

## Vercel Deployment

[Vercel](https://vercel.com/) is the recommended deployment platform for WriteSpace. It provides zero-configuration deployments for Vite projects with automatic HTTPS, global CDN, and preview deployments for pull requests.

### Automatic Deploys from Git

This is the recommended approach for production deployments:

1. **Push your code** to a Git repository on GitHub, GitLab, or Bitbucket.

2. **Import the project** in the [Vercel Dashboard](https://vercel.com/dashboard):
   - Click **"Add New…"** → **"Project"**
   - Select your Git provider and repository
   - Vercel will auto-detect the Vite framework

3. **Verify the build settings** (Vercel auto-detects these, but confirm they match):

   | Setting           | Value             |
   | ----------------- | ----------------- |
   | **Framework**     | Vite              |
   | **Build Command** | `npm run build`   |
   | **Output Directory** | `dist`         |
   | **Install Command** | `npm install`   |

4. **Click Deploy** — Vercel will install dependencies, build the project, and deploy the `dist/` output.

Once connected, Vercel automatically deploys on every push:

- **Production deploys** are triggered by pushes to the main/master branch.
- **Preview deploys** are created for every pull request, giving you a unique URL to test changes before merging.

### Manual Deployment via Vercel CLI

If you prefer deploying from your local machine:

1. Install the Vercel CLI globally:

   ```bash
   npm install -g vercel
   ```

2. Log in to your Vercel account:

   ```bash
   vercel login
   ```

3. Deploy from the project root:

   ```bash
   vercel
   ```

   For a production deployment:

   ```bash
   vercel --prod
   ```

### SPA Rewrite Configuration

WriteSpace uses client-side routing via React Router v6. All routes (e.g., `/login`, `/my-blogs`, `/blog/:id`) must be served by `index.html` so React Router can handle them.

The included `vercel.json` file configures this rewrite rule:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**What this does:** Any request to a path that doesn't match a static file in `dist/` is rewritten to serve `index.html`. React Router then reads the URL and renders the correct page component.

**Without this rule:** Navigating directly to a route like `https://yoursite.vercel.app/my-blogs` would return a 404 error because no `my-blogs/index.html` file exists in the build output.

This file is already included in the repository root and is automatically picked up by Vercel during deployment. No additional configuration is needed.

---

## Environment Considerations

WriteSpace requires **no environment variables** for deployment. The application is entirely client-side:

- **No API keys** — There are no external API calls.
- **No backend URLs** — All data is stored in the browser's `localStorage`.
- **No secrets** — Authentication uses client-side localStorage with a hard-coded admin account.
- **No `import.meta.env.VITE_*` variables** — The app does not read any environment variables at build time or runtime.

This means the build output is identical regardless of the deployment environment. The same `dist/` directory can be deployed to any static hosting platform without modification.

### localStorage Keys

All application data is persisted in the user's browser under these keys:

| Key                    | Description              |
| ---------------------- | ------------------------ |
| `writespace_posts`     | Blog posts (JSON array)  |
| `writespace_users`     | Registered users (JSON array) |
| `writespace_session`   | Current user session (JSON object) |

**Note:** Each user's browser maintains its own independent data store. Data is not shared across browsers or devices. Clearing browser storage will reset all data.

---

## CI/CD Notes

### Automatic CI/CD with Vercel

When connected to a Git repository, Vercel provides a fully managed CI/CD pipeline:

1. **Push to main branch** → Triggers a production deployment.
2. **Open a pull request** → Triggers a preview deployment with a unique URL.
3. **Merge the pull request** → Triggers a new production deployment.

No additional CI/CD configuration (e.g., GitHub Actions, GitLab CI) is required for basic deployments.

### Running Tests in CI

If you want to run tests before deploying, you can add a test step to your CI pipeline. For example, with **GitHub Actions**:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm

      - run: npm ci

      - run: npm run test

      - run: npm run build
```

This ensures tests pass and the build succeeds before Vercel deploys the changes.

### Vercel Build Hooks

Vercel also supports [Ignored Build Steps](https://vercel.com/docs/concepts/projects/overview#ignored-build-step) if you want to skip deployments for certain commits (e.g., documentation-only changes). Add a custom script in your Vercel project settings or use the `vercel.json` configuration.

---

## Other Hosting Platforms

WriteSpace can be deployed to any platform that serves static files. The key requirement is configuring a **catch-all redirect** so all routes serve `index.html`.

### Netlify

1. Run `npm run build` to generate the `dist/` directory.

2. Create a `dist/_redirects` file (or add a `netlify.toml` to the project root):

   **Option A — `netlify.toml`:**
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

   **Option B — `dist/_redirects`:**
   ```
   /*    /index.html   200
   ```

3. Deploy via the Netlify Dashboard or Netlify CLI.

### GitHub Pages

1. Run `npm run build`.

2. Add a `dist/404.html` that is a copy of `dist/index.html` — GitHub Pages serves `404.html` for unknown routes, which allows React Router to handle them.

3. Deploy the `dist/` directory using the `gh-pages` branch or GitHub Actions.

**Note:** GitHub Pages does not support true SPA rewrites. The `404.html` approach works but may cause a brief 404 status code before the client-side router takes over.

### Cloudflare Pages

1. Connect your Git repository in the Cloudflare Pages dashboard.

2. Set the build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`

3. Cloudflare Pages automatically handles SPA routing — no additional configuration is needed.

---

## Troubleshooting

### 404 errors on page refresh

**Cause:** The hosting platform is not configured to serve `index.html` for all routes.

**Fix:** Ensure the SPA rewrite/redirect rule is in place. For Vercel, confirm that `vercel.json` exists in the repository root with the rewrite configuration shown above.

### Blank page after deployment

**Cause:** The build output may reference incorrect asset paths.

**Fix:** Ensure `vite.config.js` does not set a custom `base` path unless your app is served from a subdirectory. The default base (`/`) works for root-level deployments.

### Styles missing after deployment

**Cause:** Tailwind CSS may not be processing all class names.

**Fix:** Verify that `tailwind.config.js` includes all source files in the `content` array:

```js
content: [
  './index.html',
  './src/**/*.{js,jsx}',
],
```

### localStorage data not persisting

**Cause:** The browser may be in private/incognito mode, or storage has been cleared.

**Fix:** localStorage is not available in some privacy-focused browser configurations. WriteSpace requires localStorage to function. Ensure the browser allows local storage for the deployment domain.