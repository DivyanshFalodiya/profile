export default `
uniform sampler2D imgTexture;
varying vec2 vUv;
void main(){
    vec3 rgbOverlay = vec3(0.,0.,0.);
    vec3 tex = texture2D(imgTexture, vUv).xyz;
    gl_FragColor = vec4(rgbOverlay + tex * tex * tex, 1);
}
`;
