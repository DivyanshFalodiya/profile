export default `
varying vec2 vUv;
varying vec3 vColor;
void main(){
    // vec3 rgbOverlay = vColor;
    // vec3 tex = texture2D(imgTexture, vUv).xyz;
    gl_FragColor = vec4(vColor , 1);
}
`;
