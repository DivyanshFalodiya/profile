// Retrieve the canvas
const canvas = document.getElementById('canvas');

// Setup the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('#dadada');

// Setup the camera
const camera = new THREE.PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
);
camera.position.set(0, 0, 10);

// Setup the clock
const clock = new THREE.Clock();

// Setup the renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.shadowMap.enabled = true;
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Set up orbit controls
// const controls = new OrbitControls(renderer.domElement);

// Object fovY wrt camera depth and fov
fovY = camera.position.z * 2 * Math.tan((camera.fov * (Math.PI / 180)) / 2);

// Add cube object
const planeGeometry = new THREE.PlaneGeometry(
    fovY * camera.aspect * 1.1,
    fovY * 1.1,
    window.innerWidth / (window.innerHeight / 50),
    50
);
const planeMaterial = new THREE.MeshLambertMaterial({
    color: '#fff',
    wireframe: true,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.castShadow = true;
plane.receiveShadow = true;
scene.add(plane);

// Add object to see shadow
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshStandardMaterial({
//         color: 'red',
//     })
// );
// cube.castShadow = true;
// scene.add(cube);

// Add lights
// Ambient light for overall
const directionalLight = new THREE.AmbientLight(0xffffff, 1);
// directionalLight.position.set(0, 0, 5);
// directionalLight.castShadow = true;
scene.add(directionalLight);

// Spot light for mouse tracking
const spotTarget = new THREE.Object3D();
spotTarget.position.set(0, 0, 0);
scene.add(spotTarget);

const spotLight = new THREE.SpotLight('#fff');
spotLight.position.set(0, 0, 0.8);
// spotLight.angle = Math.PI / 6;
spotLight.target = spotTarget;
scene.add(spotLight);

// Convert 2d to 3d space
const convertClientToWorld = (x, y, camera) => {
    var vec = new THREE.Vector3();
    var pos = new THREE.Vector3();

    vec.set(
        (x / window.innerWidth) * 2 - 1,
        -(y / window.innerHeight) * 2 + 1,
        0.5
    );
    vec.unproject(camera);
    vec.sub(camera.position).normalize();

    var distance = -camera.position.z / vec.z;
    pos.copy(camera.position).add(vec.multiplyScalar(distance));

    return pos;
};

// Mouse move event
window.addEventListener('mousemove', (e) => {
    pos = convertClientToWorld(e.clientX, e.clientY, camera);

    spotTarget.position.set(pos.x, pos.y, 0);
    pos2 = spotLight.position.clone();
    spotLight.position.set(pos.x, pos.y, pos2.z);
});

// Hover effect
document.addEventListener('mouseover', (e) => {
    tag = e.target.tagName;
    if (tag == 'A') {
        pos = spotLight.position.clone();
        pos.z = 1;
        spotLight.position.lerp(pos, 1);
    } else {
        pos = spotLight.position.clone();
        pos.z = 0.8;
        spotLight.position.lerp(pos, 1);
    }
});

// On click effect
document.addEventListener('click', (e) => {
    pos = convertClientToWorld(e.clientX, e.clientY, camera);
});

// Window Resize event
window.addEventListener('resize', () => {
    // Canvas resize
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';

    // Camera update
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();

    // Object update
    geometry = new THREE.PlaneGeometry(
        fovY * camera.aspect * 1.1,
        fovY * 1.1,
        window.innerWidth / (window.innerHeight / 50),
        50
    );
    plane.geometry.dispose();
    plane.geometry = geometry.clone();
    plane.geometry.buffersNeedUpdate = true;

    // Renderer update
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});

// Create plane wave
const updatePlane = (plane, time) => {
    const positions = plane.geometry.attributes.position.array;

    for (let i = 2; i < positions.length; i += 3) {
        waveX = Math.sin(positions[i - 2] + time) * 0.5;
        waveY = Math.sin(positions[i - 1] + time) * 0.5;
        positions[i] = waveX + waveY;
    }

    plane.geometry.attributes.position.array = positions;
    plane.geometry.attributes.position.needsUpdate = true;
};

// Render function for animation
const render = () => {
    const time = clock.getElapsedTime();
    updatePlane(plane, time);

    // controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(render);
};

render();
