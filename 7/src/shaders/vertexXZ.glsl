#include <begin_vertex>

float angle = position.y * 0.3;
mat2 rotateMatrix = get2dRotateMatrix(angle);

transformed.xz = rotateMatrix * transformed.yz;