import { useEffect, useState } from 'react';
import { RubiksBackground } from './components/RubiksBackground';
import { Header } from './components/Header';
import { GlassPanel } from './components/GlassPanel';
import { Navigation, tabs } from './components/Navigation';
import type { Tab } from './components/Navigation';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';

function currentTab(): Tab {
  const path = window.location.pathname.replace(/^\/|\/$/g, '');
  const hash = window.location.hash.slice(1);
  return tabs.find(tab => tab === hash || tab === path) ?? 'about';
}

export default function App() {
  const [active, setActive] = useState<Tab>(currentTab);
  useEffect(() => {
    const redirect = sessionStorage.getItem('redirect');
    if (redirect && tabs.some(tab => `/${tab}` === redirect)) {
      sessionStorage.removeItem('redirect');
      history.replaceState(null, '', `/#${redirect.slice(1)}`);
      setActive(currentTab());
    }
    const sync = () => setActive(currentTab());
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => { window.removeEventListener('popstate', sync); window.removeEventListener('hashchange', sync); };
  }, []);

  function changeTab(tab: Tab) {
    if (tab === active) return;
    history.pushState(null, '', `/#${tab}`);
    setActive(tab);
  }

  return <>
    <a href="#main-content" className="skip-link">skip to content</a>
    <RubiksBackground />
    <div className="page-shell relative z-10">
      <Header />
      <GlassPanel>
        <Navigation active={active} onChange={changeTab} />
        {tabs.map(tab => <div key={tab} id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0} hidden={active !== tab}>
          {tab === 'about' ? <About /> : tab === 'projects' ? <Projects /> : <Contact />}
        </div>)}
      </GlassPanel>
    </div>
  </>;
}
