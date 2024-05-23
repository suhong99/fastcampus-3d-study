import { Html, Sparkles } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
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

  useEffect(() => {
    const bodyClassList = window?.document.body.classList;
    if (isHover) {
      bodyClassList.add('drag');
    } else {
      bodyClassList.remove('drag');
    }

    return () => {
      bodyClassList.remove('drag');
    };
  }, [isHover]);

  return (
    <group position={[0, -1.5, 0]}>
      <Sparkles position={[0, 2, 0]} count={100} />
      <mesh
        scale={1.3}
        rotation-z={-Math.PI / 2}
        ref={ref}
        onPointerEnter={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <primitive object={glb.scene}></primitive>
      </mesh>
      <Html center>
        <span className="rotation-icon">
          <img src="/icons/rotation.png" alt="icon" />
        </span>
      </Html>
    </group>
  );
}

export default Earth;
