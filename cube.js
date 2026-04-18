const container = document.getElementById('rubiksCube')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
)

camera.position.set(5, 5, 5);
camera.lookAt(0,0,0)

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
})

renderer.setSize(container.clientWidth, container.clientHeight)
renderer.setPixelRatio(window.devicePixelRatio)

container.appendChild(renderer.domElement)

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera)
}

animate()

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
    const geometry = new THREE.BoxGeometry(.9, .9, .9)

    const materials = [
        new THREE.MeshStandardMaterial({ color: x === 1  ? COLORS.red    : COLORS.black }),
        new THREE.MeshStandardMaterial({ color: x === -1 ? COLORS.orange : COLORS.black }),
        new THREE.MeshStandardMaterial({ color: y === 1  ? COLORS.white  : COLORS.black }),
        new THREE.MeshStandardMaterial({ color: y === -1 ? COLORS.yellow : COLORS.black }),
        new THREE.MeshStandardMaterial({ color: z === 1  ? COLORS.blue   : COLORS.black }),
        new THREE.MeshStandardMaterial({ color: z === -1 ? COLORS.green  : COLORS.black }),
    ]

    const cubie = new THREE.Mesh(geometry, materials)

    const edges = new THREE.EdgesGeometry(geometry)
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 })
    const outline = new THREE.LineSegments(edges, lineMaterial)
    cubie.add(outline);

    cubie.position.set(x,y,z)
    return cubie
}

const cubies = []

const cubeGroup = new THREE.Group()
scene.add(cubeGroup)

for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
            if (x === 0 && y === 0 && z === 0) continue;

            const cubie = createCube(x, y, z)
            cubies.push(cubie)
            cubeGroup.add(cubie)
        }
    }
}

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
directionalLight.position.set(5, 10, 7)
scene.add(directionalLight);

let isDragging = false
let previousMouse = { x: 0, y: 0}


renderer.domElement.addEventListener('mousedown', (e) => {
    isDragging = true
    previousMouse = { x: e.clientX, y: e.clientY}
})

renderer.domElement.addEventListener('mousemove', (e) => {
    if (isDragging == false) {
        return
    }
    
    const deltaX = e.clientX - previousMouse.x
    const deltaY = e.clientY - previousMouse.y
    
    const rotateX = new THREE.Quaternion();
    const rotateY = new THREE.Quaternion();

    rotateX.setFromAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * 0.01);
    rotateY.setFromAxisAngle(new THREE.Vector3(1, 0, 0), deltaY * 0.01);

    cubeGroup.quaternion.premultiply(rotateX);
    cubeGroup.quaternion.premultiply(rotateY);

    previousMouse = { x: e.clientX, y: e.clientY}
})

renderer.domElement.addEventListener('mouseup', () => {
    isDragging = false
})

let isAnimating = false;
