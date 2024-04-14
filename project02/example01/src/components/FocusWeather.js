import { useBounds } from '@react-three/drei';

export function FocusWeather({ children }) {
  const bounds = useBounds();
  const handleClick = (e) => {
    e.stopPropagation();
    // 대상을 향해 포커스
    // console.log(e.object);
    bounds.refresh(e.object).fit();
  };
  return (
    <group
      onClick={handleClick}
      onPointerMissed={(e) => e.button === 0 && bounds.refresh().fit()}
    >
      {children}
    </group>
  );
}
