# j4son.dev

A React + TypeScript portfolio, built with Vite and Tailwind CSS. The vibrant canvas mosaic stays fixed behind a warm paper-like reading surface with irregular edges. Existing project write-ups are preserved.

## Run locally

Use Node.js 22.18+ (or a current Node.js LTS release).

```sh
npm install
npm run dev
```

Open the local URL Vite prints (normally http://localhost:5173).

```sh
npm run build   # Type-check and create the production site in dist/
npm run preview # Preview the production build locally
npm test        # Verify cube turns, inverse turns, and sticker conservation
```

## Components and content

- `src/App.tsx`: active section, shareable hash URLs, browser back/forward, and compatibility with existing /about, /projects, and /contact links.
- `src/components/Header.tsx`: the centered logo above the glass panel, using the bundled Crayon Libre Regular font.
- `GlassPanel.tsx`, `Navigation.tsx`: shared layout and accessible tabs (arrow keys, Home, End).
- `About.tsx`: Jason's updated introduction, interests, and hobbies, edited for grammar, with a smaller Rubik's background note at the bottom. The copy spans the panel's content width.
- `Achievements.tsx`: achievement titles, events, project links, and responsive two-column showcase, displayed only in the Projects tab by `Projects.tsx`.
- `Contact.tsx`: existing GitHub, LinkedIn, and Twitter links.
- `src/lib/projectArt.ts`: the original Halo and OttoTrade ASCII illustrations.
- `src/styles/globals.css`: logo sizing, paper silhouette and shadow, background intensity, typography, and mobile adjustments. The About text uses a readable system sans-serif; navigation keeps JetBrains Mono. Layout utilities use Tailwind CSS.

## Rubik's background

`src/lib/rubiks.ts` simulates complete, independent six-face cubes. Each has 54 stickers with integer positions and normals. A valid quarter turn rotates an outer layer, including its face and all four adjacent edge strips. Cubes begin scrambled with 32 random turns.

`src/lib/rubiksCanvas.ts` maps the cube faces into a continuous 2D grid. Every square and black border stays fixed: tile colors switch instantly between cube states, with no fading, blending, visual rotation, translation, or scaling. All faces use identical tile sizes and border widths, with no extra space between groups.

One `requestAnimationFrame` loop runs independently of React, with random timings for each cube. The canvas only redraws when a cube changes. Tile size adapts to the viewport to fit at least eight 3×3 faces across and six down (24 columns by 18 rows of tiles). Extra tiles cover the remaining edges on wider or taller screens. Borders scale with tile size. Adjust `COLORS` in `rubiks.ts`, and tile sizes and change intervals in `rubiksCanvas.ts`. Rendering uses CSS pixels with device-pixel-ratio scaling capped at 2 to limit GPU memory use. Resize updates the canvas dimensions; cleanup removes listeners and cancels frames. Hidden tabs suspend rendering. Reduced-motion preferences produce a static mosaic, including when the preference changes while the page is open.

## Crayon Libre

The original Crayon Libre Regular webfont by GGBotNet is bundled at:

```text
public/fonts/CrayonLibre.woff2
```

The font is self-hosted and preloaded, with no third-party runtime requests. Its `@font-face` is in `globals.css`. Source and license details are in `public/fonts/README.md` and `public/fonts/LICENSE-CC0.txt`. Crayon Libre is released under CC0. JetBrains Mono is self-hosted through its npm package.

## Hosting

Deploy the **contents of `dist/`**, after `npm run build`. Vite builds the homepage and all three project articles as separate HTML entry points. The static-copy script preserves article assets, legacy files, custom-domain `CNAME`, `.nojekyll`, and `404.html`, without overwriting the built article HTML.

The blog pages use `src/blog.ts` to share the homepage's canvas animation and self-hosted fonts, with layout rules in `src/styles/blog.css`. The smaller paper frame fits within the viewport with a generous grid outline on all four sides and a maximum width of 1280px plus eight grid squares (four extra on each side), capped by the available viewport. It inherits the homepage's exact paper silhouette. A shared inner scroll container places the scrollbar at the right edge of the paper, away from the text. The paper stays fixed; navigation is sticky on desktop and scrolls with the content on mobile. Article text, artwork, section anchors, and external links remain in `projects/*/index.html`; `script.js` provides the artwork and highlights sections relative to the paper scroll area. Add future article HTML entry points to `vite.config.ts` so Vite builds them too.

For GitHub Pages, use GitHub Actions to build and upload `dist/` instead of serving the unbuilt repository. The included workflow builds on pushes to `main` or manual dispatch. Set **Settings â†’ Pages â†’ Source â†’ GitHub Actions** in the repository. No deployment or repository push is performed by local development.

The layout keeps the Crayon Libre logo above the content, with a two-second entrance fade. A warm off-white paper silhouette with gently irregular edges replaces the glass rectangle. The original vibrant Rubik's grid appears at full opacity behind the paper, keeping color changes instantaneous. About uses a system sans-serif for easier reading, while navigation stays monospace. The About tab contains Jason's introduction across the full content width, with a smaller background note anchored at the bottom. Achievement showcases are in the Projects tab.
