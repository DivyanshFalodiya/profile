// Retrieve the canvas
const canvas = document.getElementById('canvas');

// Setup the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('#dadada');

const camera = new THREE.PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
);
camera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Object fovY wrt camera depth and fov
fovY = camera.position.z * 2 * Math.tan((camera.fov * (Math.PI / 180)) / 2);

// Add cube object
const planeGeometry = new THREE.PlaneGeometry(fovY * camera.aspect, fovY);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: '#dadada',
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

// Add lights
// Ambient light for overall
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// Spot light for mouse tracking
const spotTarget = new THREE.Object3D();
spotTarget.position.set(0, 0, 0);
scene.add(spotTarget);

const spotLight = new THREE.SpotLight('#fff');
spotLight.position.set(0, 0, 0.3);
// spotLight.angle = Math.PI / 6;
spotLight.target = spotTarget;
scene.add(spotLight);

// Mouse move event
window.addEventListener('mousemove', (e) => {
    var vec = new THREE.Vector3();
    var pos = new THREE.Vector3();

    vec.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
        0.5
    );
    vec.unproject(camera);
    vec.sub(camera.position).normalize();

    var distance = -camera.position.z / vec.z;
    pos.copy(camera.position).add(vec.multiplyScalar(distance));

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
        pos.z = 0.3;
        spotLight.position.lerp(pos, 1);
    }
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
    geometry = new THREE.PlaneGeometry(fovY * camera.aspect, fovY);
    plane.geometry.dispose();
    plane.geometry = geometry.clone();
    plane.geometry.buffersNeedUpdate = true;

    // Renderer update
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});

// Render function for animation
const render = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
};

render();
