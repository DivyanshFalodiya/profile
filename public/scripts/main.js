// Retrieve the canvas
const canvas = document.getElementById('canvas');

// Setup the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('#000');

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

// Object fovY wrt camera depth and fov
fovY = camera.position.z * 2 * Math.tan((camera.fov * (Math.PI / 180)) / 2);
planeSize = fovY > fovY * camera.aspect ? fovY : fovY * camera.aspect;

// Add cube object
const planeGeometry = new THREE.PlaneGeometry(
    planeSize * 2,
    planeSize * 2,
    window.innerWidth / (window.innerHeight / 100),
    100
);
const planeMaterial = new THREE.MeshLambertMaterial({
    color: '#dadada',
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
// Main white light for overall
const mainLight = new THREE.PointLight(0xe4ff00, 0.5);
mainLight.position.set(0, -10, 1);
// directionalLight.castShadow = true;
scene.add(mainLight);

// Red Light
const secLight = new THREE.PointLight(0xff0000, 0.3);
secLight.position.set(10, 0, 1);
scene.add(secLight);

// Blue light
const secLight2 = new THREE.PointLight(0x0000ff, 0.5);
secLight2.position.set(-10, 0, 1);
scene.add(secLight2);

// Green light
const secLight3 = new THREE.PointLight(0x00ff00, 0.5);
secLight3.position.set(0, 10, 1);
scene.add(secLight3);

// Spot light for mouse tracking
const spotTarget = new THREE.Object3D();
spotTarget.position.set(0, 0, 0);
scene.add(spotTarget);

const spotLight = new THREE.SpotLight('#fff');
spotLight.position.set(0, 0, 0.8);
// spotLight.angle = Math.PI / 6;
spotLight.target = spotTarget;
// scene.add(spotLight);

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

    planeWavePos = {
        x: pos.x,
        y: pos.y,
    };
    curPlaneWavePos = planeWavePos;
});

// Hover effect
document.addEventListener('mouseover', (e) => {
    tag = e.target.tagName;
    if (tag == 'A' || tag == 'BUTTON') {
    }
});

// On click effect
document.addEventListener('click', (e) => {
    pos = convertClientToWorld(e.clientX, e.clientY, camera);
    newAmp = 1;
    initialAmp = planeAmplitude;
    totalTime = 1500;
    time = 0;
    interval = 50;

    // Increase to the new amp
    speed = (newAmp - initialAmp) / totalTime;
    var interval = setInterval(() => {
        if (time >= totalTime) {
            clearInterval(interval);
        } else {
            time += interval;
            planeAmplitude = initialAmp + speed * time;
        }
    }, interval);

    // Decrease to the prev amp
    setTimeout(() => {
        tmp = newAmp;
        newAmp = initialAmp;
        initialAmp = tmp;
        time = 0;
        speed = -speed;
        var interval = setInterval(() => {
            if (time >= totalTime) {
                clearInterval(interval);
            } else {
                time += interval;
                planeAmplitude = initialAmp + speed * time;
            }
        }, interval);
    }, totalTime);
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
    planeSize = fovY > fovY * camera.aspect ? fovY : fovY * camera.aspect;
    geometry = new THREE.PlaneGeometry(
        planeSize * 2,
        planeSize * 2,
        window.innerWidth / (window.innerHeight / 100),
        100
    );
    plane.geometry.dispose();
    plane.geometry = geometry.clone();
    plane.geometry.buffersNeedUpdate = true;

    // Renderer update
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});

// Create plane wave
var planeWavePos = {
    x: 0,
    y: 0,
};
var curPlaneWavePos = {
    x: 0,
    y: 0,
};
var planeAmplitude = 0.3;
const updatePlane = () => {
    const elapsedTime = clock.getElapsedTime();
    const positions = plane.geometry.attributes.position.array;

    for (let i = 2; i < positions.length; i += 3) {
        // waveX = Math.sin(positions[i - 2] + elapsedTime) * 0.2;
        // waveY = Math.sin(positions[i - 1] + elapsedTime) * 0.2;
        // waveXY =
        //     Math.sin(positions[i - 2] + positions[i - 1] + elapsedTime) * 0.2;
        // waveMix =
        //     Math.sin(positions[i - 2] - positions[i - 1] + elapsedTime) * 0.2;
        waveMix2 =
            Math.sin(
                -Math.sqrt(
                    Math.pow(positions[i - 2] - curPlaneWavePos.x, 2) +
                        Math.pow(positions[i - 1] - curPlaneWavePos.y, 2)
                ) +
                    elapsedTime * 5
            ) * planeAmplitude;
        positions[i] = waveMix2;
    }

    plane.geometry.attributes.position.array = positions;
    plane.geometry.attributes.position.needsUpdate = true;
};

// Render function for animation
const render = () => {
    updatePlane();

    renderer.render(scene, camera);
    requestAnimationFrame(render);
};

render();
