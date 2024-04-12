import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Earth = (props) => {
  const glb = useLoader(GLTFLoader, '/models/earth.glb');
  useFrame(() => {
    console.log('useFrame');
  });
  return (
    <mesh {...props}>
      <primitive object={glb.scene} />
    </mesh>
  );
};

export default Earth;
