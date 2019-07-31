export const vertexShader: string = `

attribute float size;
varying vec3 vColor;
uniform float time;
uniform float width;
uniform float height;

varying float vOpacity;
varying float vWidth;
varying float vHeight;

float map(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

void main() {
	vColor = color;
	vec4 mvPosition = vec4(position, 1.0);

	float inc = mod(time, 2000.0);
	float scatter = 2000.0;
	float speed = 1.0;
	float offset = time * speed;

	float newPosition = mvPosition.z * scatter + offset;

	newPosition = (newPosition - floor(abs(newPosition) / scatter) * scatter);

	if (newPosition > 0.0) {
		newPosition -= scatter;
	}

	mvPosition.z = newPosition;
	
	vOpacity = 1.0 * map(
	  clamp(mvPosition.z, -2000.0, -1500.0), -2000.0, -1500.0, 0.0, 1.0
	);

	vWidth = width;
	vHeight = height;
	
	mvPosition.x *= width;
  mvPosition.y *= height;

	if (abs(mvPosition.x) > width) {
		vOpacity = 0.0;
	}

	if (abs(mvPosition.y) > height) {
		vOpacity = 0.0;
  }
  
  mat4 matrix = projectionMatrix;

  //matrix[2][3] = newPosition/10.;
	
	gl_PointSize = size * (1000.0 / -mvPosition.z);
	gl_Position = matrix * mvPosition;
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
varying float vWidth;
varying float vHeight;

vec4 blendColors(vec4 front, vec4 back) {
  	return vec4(mix(back.rgb, front.rgb, front.a / (front.a + back.a)), front.a + back.a - front.a * back.a);
}

// vec4 getNebulaColor(vec3 globalPosition, vec3 rayDirection) {
//     vec3 color = vec3(0.0);
//     float spaceLeft = 1.0;
    
//     const float layerDistance = 10.0;
//     float rayLayerStep = rayDirection.z / layerDistance;
    
//     const int steps = 4;
//     for (int i = 0; i <= steps; i++) {
//     	vec3 noiseeval = globalPosition + rayDirection * ((1.0 - fract(globalPosition.z / layerDistance) + float(i)) * layerDistance / rayDirection.z);
//     	noiseeval.xy += noiseeval.z;
        
        
//         float value = 0.06 * texture(iChannel0, fract(noiseeval.xy / 60.0)).r;
         
//         if (i == 0) {
//             value *= 1.0 - fract(globalPosition.z / layerDistance);
//         } else if (i == steps) {
//             value *= fract(globalPosition.z / layerDistance);
//         }
        
//         float hue = mod(noiseeval.z / layerDistance / 34.444, 1.0);
        
//         color += spaceLeft * hsv2rgb(vec3(hue, 1.0, value));
//         spaceLeft = max(0.0, spaceLeft - value * 2.0);
//     }
//     return vec4(color, 1.0);
// }

void main() {
	if (vOpacity == 0.0) discard;

	vec4 color = vec4(vColor, vOpacity);
	
	gl_FragColor = color * texture2D(texture1, gl_PointCoord) * texture2D(texture2, gl_PointCoord);
}
			
`;
