import { Canvas } from '@react-three/fiber';
import Scene from '../components/Scene';
import { Suspense } from 'react';
import { Loader, OrbitControls } from '@react-three/drei';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AnimatedOutlet from '../components/AnimatedOutlet';

function Home() {
  const location = useLocation();

  return (
    <>
      {/* // r3f에서 자동을 카메라 렌더러 scene을 Canvas에서 선언해줌 */}
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={['rgb(67, 127, 240) 100%)']} />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
        <OrbitControls
          makeDefault
          enablePan={false} // 좌우상하 카메라 이동 제한함
          minDistance={2} // 카메라 최소 거리
          maxDistance={15}
          minAzimuthAngle={-Math.PI / 4} //좌우회전 제한
          maxAzimuthAngle={Math.PI / 4}
          minPolarAngle={Math.PI / 6} // 위 아래 제한
          maxPolarAngle={Math.PI - Math.PI / 6}
        />
      </Canvas>
      <Loader />
      <AnimatePresence>
        <AnimatedOutlet key={location.pathname} />
      </AnimatePresence>
    </>
  );
}

export default Home;
