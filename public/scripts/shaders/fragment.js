export default `
varying vec2 vUv;
void main(){
    vec3 rgbOverlay = vec3(1.,1.,1.);
    // vec3 tex = texture2D(imgTexture, vUv).xyz;
    gl_FragColor = vec4(rgbOverlay , 1);
}
`;
