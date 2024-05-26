import React, { useEffect, useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { useBox } from '@react-three/cannon';
import { motion } from 'framer-motion-3d';

export function Tree({ position, model, material }) {
  const [info, setInfo] = useState(false);

  const [ref] = useBox(
    () => ({
      args: [0.3, 1, 0.3],
      type: 'Static',
      onCollide: handleCollision,
      position,
    }),
    useRef(null)
  );

  const handleCollision = (e) => {
    if (e.collisionFilters.bodyFilterGroup === 5) {
      setInfo(true);
    }
  };

  useEffect(() => {
    let timeout;
    if (info) {
      timeout = setTimeout(() => setInfo(false), 1000);
    }
    return () => clearTimeout(timeout);
  }, [info]);

  return (
    <group ref={ref}>
      <motion.group
        animate={{ scale: [0, 0.2], y: [-1, 0] }}
        transition={{ delay: 1, duration: 0.3 }}
        scale={0.2}
        position={[0, 0, 0]}
        rotation={[-1.555, 0, 0]}
      >
        <model.TreeMesh material={material} />
      </motion.group>

      {info && (
        <Html center>
          <div className="information">이것은 나무 입니다!</div>
        </Html>
      )}
    </group>
  );
}
