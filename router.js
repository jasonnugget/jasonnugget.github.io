const ROUTE_STAGE = { home: null, projects: 1, about: 2, experience: 3 };
const ROUTE_PATHS = { home: '/', projects: '/projects', about: '/about', experience: '/experience' };

const view = document.getElementById('view');
const overlay = document.getElementById('loadingOverlay');
const stickerGrid = document.getElementById('stickerGrid');
const cubeEl = document.getElementById('rubiksCube');
const body = document.body;

let transitioning = false;

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

function routeFromPath() {
    const p = location.pathname.replace(/\/+$/, '');
    if (p === '' || p === '/index.html') return 'home';
    for (const [name, path] of Object.entries(ROUTE_PATHS)) {
        if (p === path) return name;
    }
    return 'home';
}

function loadSeen() {
    try {
        const ts = parseInt(localStorage.getItem('cubeStageTs'), 10);
        const expired = !Number.isFinite(ts) || Date.now() - ts > 7 * 24 * 60 * 60 * 1000;
        if (expired) return new Set();
        const raw = localStorage.getItem('seenRoutes');
        return new Set(raw ? JSON.parse(raw) : []);
    } catch { return new Set(); }
}

function saveSeen() {
    localStorage.setItem('seenRoutes', JSON.stringify([...seenRoutes]));
}

const seenRoutes = loadSeen();

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
    requestAnimationFrame(() => {
        if (window.Cube) window.Cube.resizeRenderer();
    });
}

function resetCameraInstant() {
    const C = window.Cube;
    C.camera.position.copy(C.DEFAULT_CAMERA_POS);
    C.camera.lookAt(0, 0, 0);
    C.cubeGroup.quaternion.copy(C.DEFAULT_CUBE_QUAT);
}

function stickerGridInit() {
    stickerGrid.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const s = document.createElement('div');
        s.className = 'sticker';
        s.dataset.idx = i;
        stickerGrid.appendChild(s);
    }
}

function pickThreeStickers() {
    const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices.slice(0, 3).sort((a, b) => a - b);
}

async function projectsMorph() {
    const C = window.Cube;

    await C.tweenCubeQuaternion(C.DEFAULT_CUBE_QUAT, 500);
    await C.tweenCamera(C.TOP_DOWN_CAMERA_POS, 700);
    await wait(250);

    cubeEl.classList.add('fading-out');
    stickerGridInit();
    stickerGrid.classList.add('visible');
    await wait(500);

    const chosen = new Set(pickThreeStickers());
    const stickers = [...stickerGrid.querySelectorAll('.sticker')];
    stickers.forEach((el, i) => {
        if (!chosen.has(i)) el.classList.add('discarded');
    });
    await wait(500);

    setRouteClass('projects');
    view.innerHTML = '';
    view.appendChild(document.getElementById('tpl-projects').content.cloneNode(true));

    const cards = [...view.querySelectorAll('.projectBox')];
    cards.forEach(c => c.classList.add('pre-morph'));

    const chosenStickers = [...chosen].map(i => stickers[i]);

    await wait(20);
    const cardRects = cards.map(c => c.getBoundingClientRect());

    chosenStickers.forEach((sticker, i) => {
        const r0 = sticker.getBoundingClientRect();
        const r1 = cardRects[i];
        const tx = (r1.left + r1.width / 2) - (r0.left + r0.width / 2);
        const ty = (r1.top + r1.height / 2) - (r0.top + r0.height / 2);
        const sx = r1.width / r0.width;
        const sy = r1.height / r0.height;
        sticker.style.transition = 'transform 900ms cubic-bezier(0.65, 0, 0.35, 1)';
        sticker.style.transform = `translate(${tx}px, ${ty}px) scale(${sx}, ${sy})`;
    });

    await wait(950);

    cards.forEach(c => {
        c.classList.remove('pre-morph');
        c.classList.add('revealing');
    });
    await wait(400);

    chosenStickers.forEach(s => { s.style.opacity = '0'; });
    await wait(350);

    resetCameraInstant();
    cards.forEach(c => c.classList.remove('revealing'));
    stickerGrid.classList.remove('visible');
    stickerGrid.innerHTML = '';
    cubeEl.classList.remove('fading-out');
    body.classList.remove('loading');
    window.scrollTo(0, 0);
}

async function runTransition(route) {
    const C = window.Cube;
    const target = ROUTE_STAGE[route];
    if (target === null) { renderRoute(route); return; }

    const needSolve = C.currentStage < target;
    const firstVisit = !seenRoutes.has(route);

    if (!needSolve && !firstVisit) { renderRoute(route); return; }

    body.classList.add('loading');
    await wait(350);
    C.resizeRenderer();

    if (C.currentStage < 1 && target >= 1) {
        await C.playMoves(C.STAGE_WHITE);
        C.advanceStage(1);
    }
    if (C.currentStage < 2 && target >= 2) {
        await C.playMoves(C.STAGE_MIDDLE);
        C.advanceStage(2);
    }
    if (C.currentStage < 3 && target >= 3) {
        await C.playMoves(C.STAGE_LAST);
        C.advanceStage(3);
    }

    if (route === 'projects') {
        await projectsMorph();
    } else {
        await wait(250);
        renderRoute(route);
        await wait(30);
        body.classList.remove('loading');
    }

    if (firstVisit) {
        seenRoutes.add(route);
        saveSeen();
    }
}

async function navigateTo(route) {
    if (transitioning) return;
    if (!window.Cube) { renderRoute(route); return; }
    transitioning = true;
    try {
        await runTransition(route);
    } finally {
        transitioning = false;
    }
}

document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-route]');
    if (!a) return;
    e.preventDefault();
    const route = a.dataset.route;
    const path = ROUTE_PATHS[route];
    if (transitioning) return;
    if (routeFromPath() === route) return;
    history.pushState({ route }, '', path);
    navigateTo(route);
});

window.addEventListener('popstate', () => {
    renderRoute(routeFromPath());
});

renderRoute(routeFromPath());
