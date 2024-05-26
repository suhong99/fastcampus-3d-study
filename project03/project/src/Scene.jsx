import { Canvas } from '@react-three/fiber';
import { Ground } from './Ground';
import { Physics, Debug } from '@react-three/cannon';
import Car from './Car';
import { useRecoilValue } from 'recoil';
import { isStartScene } from './utils/atom';
import { Stats } from '@react-three/drei';
import DrawCall from './components/DrawCall';

function Scene() {
  const isStart = useRecoilValue(isStartScene);

  // // 사용하는 font 최적화
  // useEffect(() => {
  //   const fontData = fontjson;
  //   const targetText = 'How to Play ↑←↓→';
  //   const modifiedGlyphs = {};
  //   for (let i = 0; i < targetText.length; i++) {
  //     const char = targetText[i];
  //     const charKey = char in fontData.glyphs ? char : char.toUpperCase();
  //     if (charKey in fontData.glyphs) {
  //       modifiedGlyphs[charKey] = fontData.glyphs[charKey];
  //     }
  //   }
  //   const modifiedFontData = {
  //     ...fontData,
  //     glyphs: modifiedGlyphs,
  //   };
  //   console.log(JSON.stringify(modifiedFontData));
  // }, []);

  return (
    <>
      <Canvas camera={{ fov: 45, position: [1.5, 2, 4] }}>
        <ambientLight />
        <directionalLight position={[0, 5, 5]} />
        <Physics gravity={[0, -2.6, 0]}>
          <Debug>
            {isStart && <Car />}
            <Ground />
          </Debug>
        </Physics>
        <DrawCall />
        <Stats />
      </Canvas>
    </>
  );
}

export default Scene;
