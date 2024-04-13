import { Html } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function Earth() {
  const glb = useLoader(GLTFLoader, '/models/earth.glb');
  const ref = useRef(null);
  const [isHover, setHover] = useState();

  useFrame((state, delta) => {
    // 점점 내려가는 효과
    // state.camera.position.y -= delta * 0.1;

    // 회전 효과
    ref.current.rotation.y += delta * 0.1;
  });

  return (
    <group position={[0, -1.5, 0]}>
      <mesh
        scale={1.3}
        rotation-x={-Math.PI / 2}
        ref={ref}
        onPointerEnter={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <primitive object={glb.scene}></primitive>
      </mesh>
      {isHover && (
        <Html>
          <span className="rotation-icon">
            <img src="/icons/rotation.png" alt="icon" />
          </span>
        </Html>
      )}
    </group>
  );
}

export default Earth;
