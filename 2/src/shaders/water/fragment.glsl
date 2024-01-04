uniform vec3 uDepthColorOld;
uniform vec3 uDepthColorNew;
uniform vec3 uSurfaceColorOld;
uniform vec3 uSurfaceColorNew;
uniform float uColorOffset;
uniform float uColorMultiplier;

uniform float uTime;

varying float vElevation;

void main()
{
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;

    // vec3 color = mix(uDepthColorOld, uSurfaceColorOld, mixStrength);

    // gl_FragColor = vec4(color, 1.0);

    float mixValue = sin(uTime) * 0.5 + 0.5;
    mixStrength += mixValue;

    vec3 color = mix(uDepthColorOld, uDepthColorNew, mixStrength);

    color += mix(uSurfaceColorNew, uSurfaceColorOld, mixStrength);

    gl_FragColor = vec4(color, 1.0);

    #include <colorspace_fragment>
}