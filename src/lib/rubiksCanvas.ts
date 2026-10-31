import { COLORS, Cube } from './rubiks';
import type { Color, Face } from './rubiks';

interface AnimatedCube {
  cube: Cube;
  colors: Color[][];
  next: number;
}

// Rendering and scheduling live outside React; the cube simulation needs no DOM.
export class RubiksCanvas {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private cubes: AnimatedCube[] = [];
  private width = 0;
  private height = 0;
  private tile = 1;
  private columns = 0;
  private rows = 0;
  private frame = 0;
  private resizeFrame = 0;
  private running = false;
  private elapsed = 0;
  private lastTime = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Canvas 2D is unavailable.');
    this.context = context;
    this.resize();
    window.addEventListener('resize', this.onResize);
    document.addEventListener('visibilitychange', this.onVisibility);
  }

  private onResize = () => {
    cancelAnimationFrame(this.resizeFrame);
    this.resizeFrame = requestAnimationFrame(() => this.resize());
  };

  private onVisibility = () => {
    cancelAnimationFrame(this.frame);
    if (this.running && !document.hidden) {
      this.lastTime = 0;
      this.frame = requestAnimationFrame(this.tick);
    }
  };

  private resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(this.width * dpr);
    this.canvas.height = Math.round(this.height * dpr);
    this.context.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Fit at least eight faces across and six down, keeping every tile square.
    this.tile = Math.max(1, Math.floor(Math.min(this.width / 24, this.height / 18)));
    this.columns = Math.ceil(this.width / (this.tile * 3));
    this.rows = Math.ceil(this.height / (this.tile * 3));
    const count = Math.ceil(this.columns * this.rows / 6);
    while (this.cubes.length < count) {
      const cube = new Cube().scramble();
      const snapshot = cube.snapshot();
      this.cubes.push({ cube, colors: snapshot,
        next: this.elapsed + (this.cubes.length === 0 ? 0 : Math.random() * 1200) });
    }
    this.cubes.length = count;
    this.draw();
  }

  setRunning(running: boolean) {
    this.running = running;
    cancelAnimationFrame(this.frame);
    if (running && !document.hidden) {
      this.lastTime = 0;
      this.frame = requestAnimationFrame(this.tick);
    }
  }

  private tick = (time: number) => {
    if (!this.running) return;
    this.elapsed += this.lastTime ? Math.min(time - this.lastTime, 50) : 0;
    this.lastTime = time;
    let changed = false;
    for (const animation of this.cubes) {
      if (this.elapsed < animation.next) continue;
      animation.cube.turn(Math.floor(Math.random() * 6) as Face, Math.random() > 0.5);
      animation.colors = animation.cube.snapshot();
      animation.next = this.elapsed + 1500 + Math.random() * 2200;
      changed = true;
    }
    if (changed) this.draw();
    this.frame = requestAnimationFrame(this.tick);
  };

  private drawFace(colors: Color[], x: number, y: number) {
    const ctx = this.context;
    for (let index = 0; index < 9; index++) {
      ctx.fillStyle = COLORS[colors[index]];
      const tx = x + (index % 3) * this.tile;
      const ty = y + Math.floor(index / 3) * this.tile;
      ctx.fillRect(tx, ty, this.tile, this.tile);
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = Math.max(1, Math.min(4.5, this.tile * 0.075));
      ctx.strokeRect(tx, ty, this.tile, this.tile);
    }
  }

  private draw() {
    const ctx = this.context;
    ctx.fillStyle = COLORS[0];
    ctx.fillRect(0, 0, this.width, this.height);
    const size = this.tile * 3;
    for (let slot = 0; slot < this.columns * this.rows; slot++) {
      const animation = this.cubes[Math.floor(slot / 6)];
      const face = slot % 6;
      const x = slot % this.columns * size;
      const y = Math.floor(slot / this.columns) * size;
      // Commit the new solid colors immediately. Geometry never changes.
      this.drawFace(animation.colors[face], x, y);
    }
  }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.frame);
    cancelAnimationFrame(this.resizeFrame);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibility);
  }
}
