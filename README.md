# Dev Museum

A cinematic GitHub-powered project archive built with Next.js App Router, Tailwind CSS, Motion, GSAP, Three.js, Lenis, and Canvas.

## Highlights

- GitHub auto-sync repository archive
- Awwwards-style fullscreen navigation
- Simple dark / light mode without heavy overlay effects
- 3D Archive Engine data core built with Three.js
- Clean mechanical dropdown filters for archive and timeline
- Repository sorting animation with re-indexing ritual
- Museum shelf slide animation for project cards
- Repo Focus Mode that dims neighboring artifacts on hover
- Repo card X-Ray inspection on click, with scanline-only hover
- Project Trailer Generator for each repository card
- Command Palette Overlay with Ctrl/Cmd + K and / shortcuts
- Signal Theater section before the exit gift
- Timeline Film Strip with projector-style selected frame
- PDF Exit Gift ticket generator with longer staged print animation and clean printable ticket design
- SVG createDrawable-style animation on the Museum hero text
- Hidden interactive Control Room page unlocked by clicking the DM logo 3 times
- SEO metadata, sitemap, robots, manifest, copyright, and deploy-safe security headers
- Server-side GitHub sync cached with 5-minute revalidation for production friendliness
- Soft mechanical button press interactions across key controls
- Hero metadata marquee below the entrance section
- Basic interaction guard for right-click, Ctrl+U, and DevTools shortcuts

> The interaction guard is only a casual deterrent. Frontend source can never be fully hidden in a browser.

## Setup

```bash
npm install
npm run dev
```

Open:

```txt
http://localhost:3000
```

## GitHub Sync

Copy `.env.example` to `.env.local`:

```env
GITHUB_USERNAME=your-github-username
GITHUB_TOKEN=
NEXT_PUBLIC_OWNER_NAME=Candra Kirana
NEXT_PUBLIC_CONTACT_EMAIL=ck271138@gmail.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`GITHUB_TOKEN` is optional for local testing, but recommended in production to improve rate limits.

## Production Build

```bash
npm run build
npm run start
```

This project includes `vercel.json` and `.node-version` for safer deployment defaults.

Recommended Vercel environment variables:

```env
GITHUB_USERNAME=your-github-username
GITHUB_TOKEN=your_token_without_quotes
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_OWNER_NAME=Candra Kirana
NEXT_PUBLIC_CONTACT_EMAIL=your-email@example.com
```

## Hidden Control Room

Click the **DM** logo three times quickly to open:

```txt
/control-room
```
