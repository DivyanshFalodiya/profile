export default `
uniform sampler2D imgTexture;
uniform bool isTexture;
uniform float u_time;
varying vec2 vUv;
void main(){
    float dist = 0.4;
    float u_colorFactor = 1.0 * dist;
    if(isTexture){
        vec4 tex = texture2D(imgTexture, vUv);

        float grey = 0.21 * tex.r + 0.71 * tex.g + 0.07 * tex.b;

        float fragR = tex.r * u_colorFactor + grey * (1.0 - u_colorFactor);
        float fragG = tex.g * u_colorFactor + grey * (1.0 - u_colorFactor);
        float fragB = tex.b * u_colorFactor + grey * (1.0 - u_colorFactor);

        gl_FragColor = vec4(fragR, fragG, fragB, 1.0);
        gl_FragColor.a = clamp(dist, 0.2, 1.0);
    }
}
`;
