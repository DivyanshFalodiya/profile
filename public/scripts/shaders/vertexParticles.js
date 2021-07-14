export default `
uniform float time;
varying vec2 vUv;
varying vec3 vColor;
void main(){
    vUv = uv;
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1);
    gl_PointSize = 1. * abs(sin(time) + sin(mvPosition.x) + sin(mvPosition.y));
    // gl_PointSize = 2. * (1. / -mvPosition.z) * time;
    gl_Position = projectionMatrix * mvPosition;
}
`;
