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

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Add cube object
const cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
const cubeMaterial = new THREE.MeshBasicMaterial();
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

// Add lights
const pointLight = new THREE.AmbientLight(0xfff000);
scene.add(pointLight);

// Set up the camera position
camera.position.z = 10;

// Render function for animation
const render = () => {
    cube.rotation.x += Math.random() / 50;
    cube.rotation.z += Math.random() / 50;

    renderer.render(scene, camera);
    requestAnimationFrame(render);
};

render();
