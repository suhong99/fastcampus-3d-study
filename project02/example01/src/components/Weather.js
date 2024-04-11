import { useLoader } from '@react-three/fiber';
import { useMemo } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Weather = (props) => {
  const { position, weather } = props;
  const glb = useLoader(GLTFLoader, '/models/weather.glb');

  const weatherModel = useMemo(() => {
    const cloneModel = glb.nodes[weather] || glb.nodes.cloud;
    return cloneModel.clone();
  }, [weather, glb]);

  return (
    <mesh position={position}>
      <primitive object={weatherModel} />
    </mesh>
  );
};

export default Weather;
