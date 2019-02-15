export const vertexShader: string = `

attribute float size;
varying vec3 vColor;
uniform float time;
uniform float width;
uniform float height;

varying float vOpacity;

float map(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

void main() {
	vColor = color;
	vec4 mvPosition = vec4(position, 1.0);
	
	vOpacity = 1.0 * map(
	  clamp(mvPosition.z, -2000.0, -1900.0), -2000.0, -1900.0, 0.0, 1.0
	);
	
	mvPosition.x *= width;
	mvPosition.y *= height;
	
	gl_PointSize = size * (1000.0 / -mvPosition.z);
	gl_Position = projectionMatrix * mvPosition;
}

`;

export const fragmentShader: string = `

uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;
uniform sampler2D texture4;
uniform float time;
varying vec3 vColor;

varying float vOpacity;

void main() {
	vec4 color = vec4(vColor, vOpacity);
	
	gl_FragColor = color * texture2D(texture1, gl_PointCoord) * texture2D(texture2, gl_PointCoord);
}
			
`;
