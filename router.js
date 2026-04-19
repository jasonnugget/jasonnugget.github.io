const ROUTE_PATHS = { home: '/', projects: '/projects', about: '/about', experience: '/experience' };

const view = document.getElementById('view');
const body = document.body;

const bgVideo = document.getElementById('bgVideo');
const bgSrc = 'https://stream.mux.com/r6pXRAJb3005XEEbl1hYU1x01RFJDSn7KQApwNGgAHHbU.m3u8';

function tryPlay() {
    const p = bgVideo.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
}

if (bgVideo.canPlayType('application/vnd.apple.mpegurl')) {
    bgVideo.src = bgSrc;
    bgVideo.addEventListener('loadedmetadata', tryPlay, { once: true });
} else if (window.Hls && window.Hls.isSupported()) {
    const hls = new Hls({ capLevelToPlayerSize: false });
    hls.loadSource(bgSrc);
    hls.attachMedia(bgVideo);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
        hls.currentLevel = hls.levels.length - 1;
        tryPlay();
    });
    hls.on(Hls.Events.ERROR, (_e, data) => console.warn('hls error', data));
} else {
    console.warn('No HLS support in this browser');
}

bgVideo.addEventListener('ended', () => {
    bgVideo.currentTime = 0;
    tryPlay();
});

const pendingRedirect = sessionStorage.getItem('spa-redirect');
if (pendingRedirect) {
    sessionStorage.removeItem('spa-redirect');
    history.replaceState(null, '', pendingRedirect);
}

function routeFromPath() {
    const p = location.pathname.replace(/\/+$/, '');
    if (p === '' || p === '/index.html') return 'home';
    for (const [name, path] of Object.entries(ROUTE_PATHS)) {
        if (p === path) return name;
    }
    return 'home';
}

function setRouteClass(route) {
    body.classList.remove('route-home', 'route-projects', 'route-about', 'route-experience');
    body.classList.add('route-' + route);
}

function renderRoute(route) {
    const tpl = document.getElementById('tpl-' + route);
    view.innerHTML = '';
    if (tpl) view.appendChild(tpl.content.cloneNode(true));
    setRouteClass(route);
    window.scrollTo(0, 0);
}

document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-route]');
    if (!a) return;
    e.preventDefault();
    const route = a.dataset.route;
    const path = ROUTE_PATHS[route];
    if (routeFromPath() === route) return;
    history.pushState({ route }, '', path);
    renderRoute(route);
});

window.addEventListener('popstate', () => {
    renderRoute(routeFromPath());
});

renderRoute(routeFromPath());
