uniform float uSize;
uniform float uTime; 

attribute float aScale;
attribute vec3 aRandom;

varying vec3 vColor; 
varying vec2 vUv;
void main()
{
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);


    // Spin 
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.02;
    angle += angleOffset;

    modelPosition.x = tan(angle) / distanceToCenter; 
    modelPosition.y = cos(angle) * distanceToCenter;
    modelPosition.z =  sin(angle) / distanceToCenter;


    modelPosition.x += aRandom.x* (2.0/uTime);
    modelPosition.y += aRandom.y * (2.0/uTime);
    modelPosition.z += aRandom.z * (2.0/uTime);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    /**
        * Size
        */

    gl_PointSize = uSize * aScale;
    //gl_PointSize *= (1.0 / -viewPosition.z);

    vColor = color;
}