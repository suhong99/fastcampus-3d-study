import { Merged, useGLTF } from '@react-three/drei';
import { useMemo } from 'react';

import { Tree } from './Tree';

const AllTree = () => {
  const { nodes, materials } = useGLTF(`/assets/models/tree.glb`);
  const meshes = useMemo(
    () => ({
      TreeMesh: nodes.tree,
    }),
    [nodes]
  );
  return (
    <Merged castShadow meshes={meshes}>
      {(model) => (
        <>
          <Tree
            position={[1, 0.5, -1]}
            model={model}
            material={materials['Material.003']}
          />
          <Tree
            position={[-1, 0.5, -1]}
            model={model}
            material={materials['Material.003']}
          />
          <Tree
            position={[3, 0.5, -1]}
            model={model}
            material={materials['Material.003']}
          />
          <Tree
            position={[-3, 0.5, -1]}
            model={model}
            material={materials['Material.003']}
          />
          <Tree
            position={[-6, 0.5, 0]}
            model={model}
            material={materials['Material.003']}
          />
          <Tree
            position={[-6, 0.5, -2]}
            model={model}
            material={materials['Material.003']}
          />
          <Tree
            position={[-6, 0.5, -4]}
            model={model}
            material={materials['Material.003']}
          />
          <Tree
            position={[-6, 0.5, -6]}
            model={model}
            material={materials['Material.003']}
          />
          <Tree
            position={[-6, 0.5, -6]}
            model={model}
            material={materials['Material.003']}
          />
          <Tree
            position={[-6, 0.5, -8]}
            model={model}
            material={materials['Material.003']}
          />
          <Tree
            position={[-6, 0.5, -10]}
            model={model}
            material={materials['Material.003']}
          />
        </>
      )}
    </Merged>
  );
};

export default AllTree;
