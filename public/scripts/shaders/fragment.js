export default `
uniform sampler2D imgTexture;
varying vec2 vUv;
void main(){
    gl_FragColor = vec4(vec3(0,0,0) + texture2D(imgTexture, vUv).xyz, 1);
}
`;
