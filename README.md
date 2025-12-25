# Hark Article UI

Pixel-perfect recreation of the Hark article reading interface based on four screenshots.

## Screens

- **Screen 1** (`/screen1`): Article reading view with playback controls
- **Screen 2** (`/screen2`): Article reading view with "View More" section
- **Screen 3** (`/screen3`): Full audio player screen with artwork
- **Screen 4** (`/screen4`): Article detail/landing page

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the homepage with links to all screens.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS

## Notes

- All screens are optimized for mobile viewport (max-width: 28rem / 448px)
- Colors match the original design (Hark red: #DC2626)
- Typography uses system fonts (SF Pro-like on iOS, Helvetica Neue/Arial elsewhere)
- Article artwork is placeholder - replace with actual images in production

