uniform float uSize;
uniform float uTime; 

attribute float aScale;
attribute vec3 aRandom;

varying vec3 vColor; 

void main()
{
    /**
        * Position
        */

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Spin 
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.02;
    angle += angleOffset;

    modelPosition.x = cos(angle) * distanceToCenter; 
    modelPosition.z = sin(angle) / distanceToCenter;
    modelPosition.y = tan(angle) / distanceToCenter;

    modelPosition.x += aRandom.x; 
    modelPosition.y += aRandom.y; 
    modelPosition.z += aRandom.z * uTime * 1.0;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    /**
        * Size
        */

    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / -viewPosition.z);

    vColor = color;
}