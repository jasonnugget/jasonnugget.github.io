import { useRef } from 'react';

export const tabs = ['about', 'projects', 'contact'] as const;
export type Tab = typeof tabs[number];

export function Navigation({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return <nav aria-label="Portfolio sections" className="portfolio-nav">
    <div role="tablist" aria-label="Portfolio" className="flex gap-7 sm:gap-10">
      {tabs.map((tab, index) => <button key={tab} ref={element => { refs.current[index] = element; }}
        id={`tab-${tab}`} role="tab" aria-selected={active === tab} aria-controls={`panel-${tab}`}
        tabIndex={active === tab ? 0 : -1} className="nav-tab py-2" onClick={() => onChange(tab)}
        onKeyDown={event => {
          let next = index;
          if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
          else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = tabs.length - 1;
          else return;
          event.preventDefault(); onChange(tabs[next]); refs.current[next]?.focus();
        }}>{tab}</button>)}
    </div>
  </nav>;
}
