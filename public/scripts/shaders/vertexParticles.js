export default `
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
unifrom sampler2D texture1;
void main(){
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1)
    gl_PointSize = 100 * (1 / -mvPosition.z)
    gl_Position = projectionMatrix * mvPosition;
}
`;
