uniform vec3 color;
varying vec3 vPosition;
varying vec2 vUv;

uniform float uTime;
uniform float uWaveSpeed;
uniform float uWaveFrequency;

void main() {
    float directionColor = abs(cos(uTime * uWaveSpeed + vUv.x * uWaveFrequency));

    gl_FragColor = vec4(
    color * directionColor,
    1.0);
}