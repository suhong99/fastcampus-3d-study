import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function Earth(props) {
  const glb = useLoader(GLTFLoader, '/models/earth.glb');
  //   console.log(glb);
  glb.scene.position.x = 1;
  glb.scene.rotation.y = 1;

  return (
    <mesh {...props}>
      <primitive object={glb.scene}></primitive>
    </mesh>
  );
}

export default Earth;
