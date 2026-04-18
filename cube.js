const container = document.getElementById('rubiksCube');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);

const DEFAULT_CAMERA_POS = new THREE.Vector3(5, 5, 5);
const TOP_DOWN_CAMERA_POS = new THREE.Vector3(0, 7.5, 0.001);

const DEFAULT_CUBE_QUAT = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);

camera.position.copy(DEFAULT_CAMERA_POS);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

function resizeRenderer() {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
}
resizeRenderer();
window.addEventListener('resize', resizeRenderer);

const COLORS = {
    red:    0xb71234,
    orange: 0xff5800,
    white:  0xffffff,
    yellow: 0xffd500,
    blue:   0x0046ad,
    green:  0x009b48,
    black:  0x0a0a0a
};

function createCube(x, y, z) {
    const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    const materials = [
        new THREE.MeshStandardMaterial({ color: x ===  1 ? COLORS.red    : COLORS.black }),
        new THREE.MeshStandardMaterial({ color: x === -1 ? COLORS.orange : COLORS.black }),
        new THREE.MeshStandardMaterial({ color: y ===  1 ? COLORS.yellow : COLORS.black }),
        new THREE.MeshStandardMaterial({ color: y === -1 ? COLORS.white  : COLORS.black }),
        new THREE.MeshStandardMaterial({ color: z ===  1 ? COLORS.green  : COLORS.black }),
        new THREE.MeshStandardMaterial({ color: z === -1 ? COLORS.blue   : COLORS.black })
    ];
    const cubie = new THREE.Mesh(geometry, materials);
    const edges = new THREE.EdgesGeometry(geometry);
    const outline = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
    cubie.add(outline);
    cubie.position.set(x, y, z);
    return cubie;
}

const cubeGroup = new THREE.Group();
cubeGroup.quaternion.copy(DEFAULT_CUBE_QUAT);
scene.add(cubeGroup);

const cubies = [];
for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
            if (x === 0 && y === 0 && z === 0) continue;
            const c = createCube(x, y, z);
            cubies.push(c);
            cubeGroup.add(c);
        }
    }
}

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

const MOVE_DEFS = {
    R: { axis: 'x', layer:  1, sign: -1 },
    L: { axis: 'x', layer: -1, sign:  1 },
    U: { axis: 'y', layer:  1, sign: -1 },
    D: { axis: 'y', layer: -1, sign:  1 },
    F: { axis: 'z', layer:  1, sign: -1 },
    B: { axis: 'z', layer: -1, sign:  1 }
};

function parseSingle(token) {
    const face = token[0];
    const def = MOVE_DEFS[face];
    if (!def) throw new Error('bad move: ' + token);
    let sign = def.sign;
    if (token.length > 1 && token[1] === "'") sign = -sign;
    return { axis: def.axis, layer: def.layer, sign };
}

function invertToken(token) {
    if (token.endsWith('2')) return token;
    if (token.endsWith("'")) return token[0];
    return token[0] + "'";
}

function invertSequence(seq) {
    return seq.slice().reverse().map(invertToken);
}

let busy = false;

function turnInstant(token) {
    const m = parseSingle(token);
    const axisVec = new THREE.Vector3(
        m.axis === 'x' ? 1 : 0,
        m.axis === 'y' ? 1 : 0,
        m.axis === 'z' ? 1 : 0
    );
    const q = new THREE.Quaternion().setFromAxisAngle(axisVec, (Math.PI / 2) * m.sign);
    const affected = cubies.filter(c => Math.abs(c.position[m.axis] - m.layer) < 0.1);
    for (const c of affected) {
        c.position.applyQuaternion(q);
        c.position.x = Math.round(c.position.x);
        c.position.y = Math.round(c.position.y);
        c.position.z = Math.round(c.position.z);
        c.quaternion.premultiply(q);
    }
}

function turnAnimated(token, durationMs) {
    return new Promise(resolve => {
        const m = parseSingle(token);
        const axisVec = new THREE.Vector3(
            m.axis === 'x' ? 1 : 0,
            m.axis === 'y' ? 1 : 0,
            m.axis === 'z' ? 1 : 0
        );
        const targetAngle = (Math.PI / 2) * m.sign;
        const affected = cubies.filter(c => Math.abs(c.position[m.axis] - m.layer) < 0.1);

        const tempGroup = new THREE.Group();
        cubeGroup.add(tempGroup);
        for (const c of affected) tempGroup.attach(c);

        const start = performance.now();
        function step(now) {
            const t = Math.min(1, (now - start) / durationMs);
            const eased = t * t * (3 - 2 * t);
            tempGroup.quaternion.setFromAxisAngle(axisVec, targetAngle * eased);
            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                for (const c of affected) {
                    cubeGroup.attach(c);
                    c.position.x = Math.round(c.position.x);
                    c.position.y = Math.round(c.position.y);
                    c.position.z = Math.round(c.position.z);
                }
                cubeGroup.remove(tempGroup);
                resolve();
            }
        }
        requestAnimationFrame(step);
    });
}

function expandDoubles(seq) {
    const out = [];
    for (const raw of seq) {
        if (raw.endsWith('2')) {
            out.push(raw[0], raw[0]);
        } else {
            out.push(raw);
        }
    }
    return out;
}

async function playMoves(moves, durationMs = 220) {
    busy = true;
    try {
        for (const mv of expandDoubles(moves)) {
            await turnAnimated(mv, durationMs);
        }
    } finally {
        busy = false;
    }
}

function applyMovesInstant(moves) {
    for (const mv of expandDoubles(moves)) {
        turnInstant(mv);
    }
}

const STAGE_WHITE = [
    "F", "R", "U", "R'", "U'", "F'",
    "U", "R", "U'", "R'", "U'", "F'", "U", "F",
    "D'", "R", "U", "R'", "D"
];

const STAGE_MIDDLE = [
    "U", "R", "U'", "R'", "U'", "F'", "U", "F",
    "U'", "L'", "U", "L", "U", "F", "U'", "F'"
];

const STAGE_LAST = [
    "R", "U", "R'", "U", "R", "U", "U", "R'",
    "R", "U", "R'", "U'", "R'", "F", "R", "R", "U'", "R'", "U'", "R", "U", "R'", "F'"
];

const FULL_SOLUTION = [...STAGE_WHITE, ...STAGE_MIDDLE, ...STAGE_LAST];
const SCRAMBLE = invertSequence(FULL_SOLUTION);

const STAGE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

function loadStage() {
    const ts = parseInt(localStorage.getItem('cubeStageTs'), 10);
    if (!Number.isFinite(ts) || Date.now() - ts > STAGE_EXPIRY_MS) return 0;
    const s = parseInt(localStorage.getItem('cubeStage'), 10);
    return Number.isFinite(s) && s >= 0 && s <= 3 ? s : 0;
}

function saveStage(stage) {
    localStorage.setItem('cubeStage', String(stage));
    localStorage.setItem('cubeStageTs', String(Date.now()));
}

let currentStage = loadStage();

applyMovesInstant(SCRAMBLE);
if (currentStage >= 1) applyMovesInstant(STAGE_WHITE);
if (currentStage >= 2) applyMovesInstant(STAGE_MIDDLE);
if (currentStage >= 3) applyMovesInstant(STAGE_LAST);

let isDragging = false;
let previousMouse = { x: 0, y: 0 };

renderer.domElement.addEventListener('mousedown', (e) => {
    if (busy) return;
    isDragging = true;
    previousMouse = { x: e.clientX, y: e.clientY };
});

renderer.domElement.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - previousMouse.x;
    const dy = e.clientY - previousMouse.y;
    const rx = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), dx * 0.01);
    const ry = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), dy * 0.01);
    cubeGroup.quaternion.premultiply(rx);
    cubeGroup.quaternion.premultiply(ry);
    previousMouse = { x: e.clientX, y: e.clientY };
});

renderer.domElement.addEventListener('mouseup',    () => { isDragging = false; });
renderer.domElement.addEventListener('mouseleave', () => { isDragging = false; });

function tween(durationMs, onStep) {
    return new Promise(resolve => {
        const start = performance.now();
        function step(now) {
            const t = Math.min(1, (now - start) / durationMs);
            const eased = t * t * (3 - 2 * t);
            onStep(eased);
            if (t < 1) requestAnimationFrame(step);
            else resolve();
        }
        requestAnimationFrame(step);
    });
}

function tweenCamera(targetVec, durationMs = 600) {
    const from = camera.position.clone();
    return tween(durationMs, (t) => {
        camera.position.lerpVectors(from, targetVec, t);
        camera.lookAt(0, 0, 0);
    });
}

function tweenCubeQuaternion(targetQuat, durationMs = 600) {
    const from = cubeGroup.quaternion.clone();
    return tween(durationMs, (t) => {
        cubeGroup.quaternion.slerpQuaternions(from, targetQuat, t);
    });
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

window.Cube = {
    container,
    renderer,
    camera,
    scene,
    cubeGroup,
    cubies,
    get currentStage() { return currentStage; },
    advanceStage(target) {
        if (target > currentStage) {
            currentStage = target;
            saveStage(currentStage);
        }
    },
    playMoves,
    tweenCamera,
    tweenCubeQuaternion,
    resizeRenderer,
    STAGE_WHITE,
    STAGE_MIDDLE,
    STAGE_LAST,
    DEFAULT_CAMERA_POS,
    TOP_DOWN_CAMERA_POS,
    DEFAULT_CUBE_QUAT,
    isBusy: () => busy,
    setBusy: (v) => { busy = v; }
};
