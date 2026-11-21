import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Navigation, tabs } from './components/Navigation';
import type { Tab } from './components/Navigation';
import { Blog } from './components/Blog';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';

function currentTab(): Tab {
  const path = window.location.pathname.replace(/^\/|\/$/g, '');
  const hash = window.location.hash.slice(1);
  return tabs.find(tab => tab === hash || tab === path) ?? 'blog';
}

export default function App() {
  const [active, setActive] = useState<Tab>(currentTab);
  useEffect(() => {
    const redirect = sessionStorage.getItem('redirect');
    if (redirect && (redirect === '/about' || tabs.some(tab => `/${tab}` === redirect))) {
      sessionStorage.removeItem('redirect');
      history.replaceState(null, '', `/#${redirect === '/about' ? 'blog' : redirect.slice(1)}`);
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
    <div className="page-shell">
      <Header />
      <main id="main-content" className="main-box">
        <Navigation active={active} onChange={changeTab} />
        {tabs.map(tab => <div key={tab} id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0} hidden={active !== tab}>
          {tab === 'blog' ? <Blog /> : tab === 'projects' ? <Projects /> : <Contact />}
        </div>)}
      </main>
    </div>
  </>;
}
