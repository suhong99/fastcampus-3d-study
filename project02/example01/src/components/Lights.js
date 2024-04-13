import { useHelper, Environment } from '@react-three/drei';
import { useRef } from 'react';
import { DirectionalLightHelper } from 'three';

function Lights() {
  const ref = useRef();
  useHelper(ref, DirectionalLightHelper, 1, 'red');
  return (
    <>
      <Environment preset="forest" />
      <directionalLight position={[1, 1, -1]} intensity={3} />
      <ambientLight intensity={1} />
    </>
  );
}

export default Lights;
