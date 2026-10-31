import type { ReactNode } from 'react';

export function GlassPanel({ children }: { children: ReactNode }) {
  return <main id="main-content" className="glass-panel mx-auto">{children}</main>;
}
