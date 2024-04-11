import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Weather = (props) => {
  const { position, weather } = props;
  const glb = useLoader(GLTFLoader, '/models/weather.glb');
  // console.log(glb);
  let weatherModel;
  if (glb.nodes[weather]) {
    weatherModel = glb.nodes[weather].clone();
  } else {
    weatherModel = glb.nodes.cloud.clone();
  }
  return (
    <mesh position={position}>
      <primitive object={weatherModel} />
    </mesh>
  );
};

export default Weather;
