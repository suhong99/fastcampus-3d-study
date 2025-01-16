// Author: Fyrestar https://mevedia.com (https://github.com/Fyrestar/THREE.InfiniteGridHelper)
import * as THREE from "three";

class InfiniteGrid extends THREE.Mesh {
  constructor(size1, size2, color, distance, axes = "xzy") {
    color = color || new THREE.Color("white");
    size1 = size1 || 10;
    size2 = size2 || 100;

    distance = distance || 8000;

    const planeAxes = "xz";

    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

    // 조금 더 복잡한 연산이 가능함 (셰이더 언어 - GPU에서 실행되는 작은 프로그램임)
    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      // 전달할 매개변수
      uniforms: {
        uSize1: {
          value: size1,
        },
        uSize2: {
          value: size2,
        },
        uColor: {
          value: color,
        },
        uDistance: {
          value: distance,
        },
      },
      transparent: true,
      vertexShader: `
        varying vec3 worldPosition;
        uniform float uDistance;
        void main() {
          vec3 pos = position.${axes} * uDistance;
          pos.${planeAxes} += cameraPosition.${planeAxes};
          worldPosition = pos;  
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,

      fragmentShader: `
        varying vec3 worldPosition;
        uniform float uSize1;
        uniform float uSize2;
        uniform vec3 uColor;
        uniform float uDistance;

        float getGrid(float size) {
          vec2 r = worldPosition.${planeAxes} / size;
          vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
          float line = min(grid.x, grid.y);
          return 1.0 - min(line, 1.0);
        }

        void main() {
          float d = 1.0 - min(distance(cameraPosition.${planeAxes}, worldPosition.${planeAxes}) / uDistance, 1.0);
          float g1 = getGrid(uSize1);
          float g2 = getGrid(uSize2);
          gl_FragColor = vec4(uColor.rgb, mix(g2, g1, g1) * pow(d, 3.0));
          gl_FragColor.a = mix(0.5 * gl_FragColor.a, gl_FragColor.a, g2);
          if ( gl_FragColor.a <= 0.0 ) discard;
        }
      `,
      // derivative functions를 사용할 수 있게 함
      extensions: {
        derivatives: true,
      },
    });

    super(geometry, material);

    // 시야 밖에 있더라도 항상 랜더링 되도록 함. 무한 그리드처럼 항상 랜더링 해야하는 경우
    this.frustumCulled = false;

    // custom
    this.isInfiniteGrid = true;
  }
}

export default InfiniteGrid;
