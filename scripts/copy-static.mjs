import { cp, mkdir } from 'node:fs/promises';

// Vite builds the article HTML. Copy only static article assets and legacy files.
await mkdir('dist', { recursive: true });
for (const path of ['style.css', 'script.js', '404.html', 'CNAME', '.nojekyll']) {
  await cp(path, `dist/${path}`, { recursive: true });
}
await cp('projects', 'dist/projects', {
  recursive: true,
  filter: source => !source.endsWith('.html'),
});
