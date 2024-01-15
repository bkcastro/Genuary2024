#define PI 3.14159265359

varying vec3 vPosition; 
varying vec2 vUv;

uniform vec3 color1; 
uniform vec3 color2; 
uniform float uTime;
uniform float uDuration;
void main(){

    float pattern = step(1.0, abs(vPosition.y));

    float noiseArea = clamp((vUv.y)+1.0-(uTime/uDuration), 0.0, 1.0);
    vec3 color = mix(color2, color1, noiseArea ); 

    gl_FragColor = vec4(vec3(color) ,1.0);
}