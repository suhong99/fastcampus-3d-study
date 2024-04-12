import { useFrame, useLoader } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { motion } from 'framer-motion-3d';
const Weather = (props) => {
  const { position, weather, rotaionY } = props;
  const glb = useLoader(GLTFLoader, '/models/weather.glb');
  const ref = useRef(null);
  const weatherModel = useMemo(() => {
    const cloneModel = glb.nodes[weather] || glb.nodes.cloud;
    return cloneModel.clone();
  }, [weather, glb]);

  useFrame((_, delta) => {
    ref.current.rotation.y += delta;
  });

  return (
    <motion.mesh
      whileHover={{ scale: 1.5, transition: 0.5 }}
      ref={ref}
      position={position}
      rotation-y={rotaionY}
    >
      <primitive object={weatherModel} />
    </motion.mesh>
  );
};

export default Weather;
