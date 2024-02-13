#include <begin_vertex>

float angle = position.y * 0.3;
mat2 rotateMatrix = get2dRotateMatrix(angle);

transformed.yz = rotateMatrix * transformed.yz;