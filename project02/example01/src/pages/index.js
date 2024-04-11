import { Canvas } from '@react-three/fiber';
import Lights from '../components/Lights';
import Scene from '../components/Scene';
import { Suspense } from 'react';
import { Loader } from '@react-three/drei';

export function Home() {
  return (
    <>
      {/* // r3f에서 자동을 카메라 렌더러 scene을 Canvas에서 선언해줌 */}
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={['rgb(67,127,240) 100%)']}></color>
        <Suspense fallback={null}>
          <Lights />
          <Scene />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
}
