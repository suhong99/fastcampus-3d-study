import { motion } from 'framer-motion-3d';

const variants = {
  initial: { rotateX: 0, rotateZ: 0 },
  animate: {
    rotateX: Math.PI / 2,
    rotateZ: 1,
    scale: [1, 1.5, 1, 1.7],
    transition: { duration: 3, repeat: Infinity },
  },
};
function FramerModel() {
  return (
    // 선언적 방식으로 사용
    <motion.mesh variants={variants} initial="initial" animate="animate">
      <cylinderGeometry args={[1, 1, 0.5, 8]} />
      {/* //그냥 사용 */}
      <motion.meshBasicMaterial
        color={'white'}
        initial={{ opacity: 1 }}
        animate={{
          opacity: [1, 0.5, 1],
          transition: { duration: 0.5, repeat: Infinity },
        }}
      />
    </motion.mesh>
  );
}

export default FramerModel;
