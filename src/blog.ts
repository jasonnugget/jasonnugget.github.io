import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-500.css';
import './styles/globals.css';
import './styles/blog.css';
import { RubiksCanvas } from './lib/rubiksCanvas';

// The articles share the homepage's fixed mosaic without mounting the React UI.
const canvas = document.createElement('canvas');
canvas.className = 'rubiks-canvas';
canvas.setAttribute('aria-hidden', 'true');
document.body.prepend(canvas);

const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
let background: RubiksCanvas | null = null;
const syncMotion = () => background?.setRunning(!motion.matches);

function start() {
  if (background) return;
  background = new RubiksCanvas(canvas);
  syncMotion();
  motion.addEventListener('change', syncMotion);
}

window.addEventListener('pagehide', () => {
  motion.removeEventListener('change', syncMotion);
  background?.destroy();
  background = null;
});
window.addEventListener('pageshow', start);
start();
