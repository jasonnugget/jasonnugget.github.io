# j4son.dev

A React + TypeScript portfolio built with Vite and Tailwind CSS, using the original ASCII banner, black background, gray monospace text, and bordered content panel. The current biography is available as a blog post, alongside projects, achievements, and contact links.

## Run locally

Use Node.js 22.18+ (or a current Node.js LTS release).

```sh
npm install
npm run dev
npm run build
npm run preview
```

`npm run build` type-checks the source and creates the production site in `dist/`.

## Content and styling

- `src/App.tsx`: accessible section tabs, hash URLs, browser back/forward, and compatibility with `/about`, `/projects`, and `/contact`.
- `src/components/Header.tsx`: the original ASCII wordmark, with an accessible text heading.
- `src/components/Blog.tsx`: homepage blog previews with a title, publication date, and short description.
- `src/content/posts.ts`: blog post metadata, listed newest first. Add each new article HTML entry to `vite.config.ts`.
- `blog/about-me/index.html`: the original biography, moved into the first blog post.
- `src/components/Achievements.tsx`: project titles, events, links, and ASCII illustrations shown in the Projects tab.
- `src/components/Contact.tsx`: GitHub, LinkedIn, and Twitter links.
- `src/styles/globals.css`: homepage layout, monochrome colors, monospace typography, and mobile adjustments.
- `projects/*/index.html`: project write-ups, images, section anchors, and external links.
- `src/blog.ts`, `style.css`, and `src/styles/blog.css`: self-hosted JetBrains Mono and the original article layout with normal page scrolling and a sticky desktop table of contents.
- `script.js`: article ASCII artwork and active section highlighting.

The Rubik's background modules remain available in the source but are no longer loaded by the homepage or articles. `npm test` runs their existing cube simulation tests.

## Hosting

Deploy the contents of `dist/` after `npm run build`. Vite builds the homepage and the blog post and all three project articles as separate HTML entry points. The static-copy script preserves project assets, legacy files, custom-domain `CNAME`, `.nojekyll`, and `404.html`.

The included GitHub Pages workflow builds and deploys on pushes to `main` or manual dispatch. Local development does not push or deploy changes.
