import { useFrame, useLoader } from '@react-three/fiber';
import { useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function Earth() {
  const glb = useLoader(GLTFLoader, '/models/earth.glb');

  const ref = useRef(null);
  useFrame((state, delta) => {
    // 점점 내려가는 효과
    // state.camera.position.y -= delta * 0.1;

    // 회전 효과
    ref.current.rotation.y += delta * 0.1;
  });

  return (
    <mesh
      scale={1.3}
      rotation-x={-Math.PI / 2}
      ref={ref}
      position={[0, -1.5, 0]}
    >
      <primitive object={glb.scene}></primitive>
    </mesh>
  );
}

export default Earth;
