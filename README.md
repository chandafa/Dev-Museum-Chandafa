# Dev Museum

A cinematic GitHub-powered project archive for Creative Developers. Dev Museum turns repositories into a living museum with a responsive hero, 3D triangular archive engine, repository archive, timeline film strip, command palette, project trailers, and PDF visitor ticket.

## Quick start

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local`.

```env
GITHUB_USERNAME=chandafa
GITHUB_TOKEN=
NEXT_PUBLIC_OWNER_NAME=Candra Kirana
NEXT_PUBLIC_CONTACT_EMAIL=ck271138@gmail.com
```

`GITHUB_TOKEN` is optional, but recommended for higher GitHub API limits.

## Production build

```bash
npm ci --no-audit --no-fund
npm run build
npm run start
```

## Vercel / Netlify install notes

This zip includes:

- `.npmrc` forcing `registry=https://registry.npmjs.org/`
- cleaned `package-lock.json` with public npm registry URLs
- exact dependency versions
- Node 22 config through `.node-version` and `.nvmrc`
- `vercel.json`
- `netlify.toml`

The previous `ETIMEDOUT` deploy log happened because the lockfile resolved packages through an internal sandbox registry. This version uses public npm registry URLs, so Vercel/Netlify will not try to download from that internal host.

## Useful shortcuts

- `Ctrl/Cmd + K` or `/` — open command palette
- Triple click the `DM` logo — open Control Room

## Tech stack

Next.js App Router, Tailwind CSS, Motion, GSAP, Lenis, Three.js, HTML5 Canvas-style WebGL visuals, Outfit/system typography fallback.


## Netlify deployment notes

This version is prepared for Netlify/Vercel deployment:

- `.npmrc` forces the public npm registry: `https://registry.npmjs.org/`
- `package-lock.json` has been cleaned from internal sandbox registry URLs
- `netlify.toml` increases npm fetch timeout/retries to reduce ETIMEDOUT failures
- Use Node 22 on Netlify/Vercel

Recommended local verification:

```bash
rm -rf .next node_modules
npm ci --no-audit --no-fund --prefer-online
npm run build
```
