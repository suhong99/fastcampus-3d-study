import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

// 모니터 밖으로 나오는 방향이 z축
camera.position.x = 5;

camera.position.y = 5;
camera.position.z = 5;

const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.castShadow = true;
directionalLight.position.set(3, 4, 5);
directionalLight.lookAt(0, 0, 0);
scene.add(directionalLight);

const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xbbbbbb });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; //-90도 회전
floor.receiveShadow = true;
floor.castShadow = true;
scene.add(floor);

const frontSideGeometry = new THREE.BoxGeometry(1, 1, 1);
const frontSideMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ffff,
  side: THREE.FrontSide,
  // wireframe: true,
});
const frontSideMesh = new THREE.Mesh(frontSideGeometry, frontSideMaterial);
frontSideMesh.position.set(0, 0.5, 4);
frontSideMesh.receiveShadow = true;
frontSideMesh.castShadow = true;
scene.add(frontSideMesh);

const backSideGeometry = new THREE.BoxGeometry(1, 1, 1);
const backSideMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  side: THREE.BackSide,
});
const backSideMesh = new THREE.Mesh(backSideGeometry, backSideMaterial);
// 완벽하게 겹치면 어떤게 랜더링 될 지 몰라서 살짝 변경함
backSideMesh.position.set(2, 0.51, 4);
backSideMesh.receiveShadow = true;
scene.add(backSideMesh);

const doubleSideGeometry = new THREE.BoxGeometry(1, 1, 1);
const doubleSideMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
  shadowSide: THREE.BackSide, // 그림자를 만들 머터리얼 지정
});
const doubleSideMesh = new THREE.Mesh(doubleSideGeometry, doubleSideMaterial);
doubleSideMesh.position.set(4, 0.5, 4);
doubleSideMesh.receiveShadow = true;
doubleSideMesh.castShadow = true; // 그림자가 이상하게 동작할 수 있음.
scene.add(doubleSideMesh);

//geometry
const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.15, 100, 20);
//material

//MeshStandardMaterial
const torusKnotStandardMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0000,
});
torusKnotStandardMaterial.roughness = 0.5; // 표면의 거친 정도(매끈하지 않은 정도)
torusKnotStandardMaterial.metalness = 1; // 표면의 금속성 정도(쇠같은 재질)
const torusKnotStandardMesh = new THREE.Mesh(
  torusKnotGeometry,
  torusKnotStandardMaterial
);
torusKnotStandardMesh.castShadow = true;
torusKnotStandardMesh.receiveShadow = true;
torusKnotStandardMesh.position.set(-4, 1, 0);
scene.add(torusKnotStandardMesh);
//MeshLambertMaterial
const torusKnotLambertMaterial = new THREE.MeshLambertMaterial({
  color: 0xff0000,
});
torusKnotLambertMaterial.emissive = new THREE.Color(0x00ff00); // 빛의 영향을 받지 않는 자체 발광 색
torusKnotLambertMaterial.emissiveIntensity = 0.2; // 자체발광 세기
const torusKnotLambertMesh = new THREE.Mesh(
  torusKnotGeometry,
  torusKnotLambertMaterial
);
torusKnotLambertMesh.castShadow = true;
torusKnotLambertMesh.receiveShadow = true;
torusKnotLambertMesh.position.set(-2, 1, 0);
scene.add(torusKnotLambertMesh);
// MeshPhongMaterial
const torusKnotPhongMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
torusKnotPhongMaterial.emissive = new THREE.Color(0x00ff00); // 자체발광(빛이 닫지 않는 부분의 색상)
torusKnotPhongMaterial.emissiveIntensity = 0.2; // 자체발광 세기
torusKnotPhongMaterial.specular = new THREE.Color(0x0000ff); // 빛이 직접 닿아 반사되는 부분의 색상
torusKnotPhongMaterial.shininess = 100; // specular의 강도
const torusKnotPhongMesh = new THREE.Mesh(
  torusKnotGeometry,
  torusKnotPhongMaterial
);
torusKnotPhongMesh.castShadow = true;
torusKnotPhongMesh.receiveShadow = true;
torusKnotPhongMesh.position.set(0, 1, 0);
scene.add(torusKnotPhongMesh);

// ===========================================================================
// MeshBasicMaterial
const torusKnotBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const torusKnotBasicMesh = new THREE.Mesh(
  torusKnotGeometry,
  torusKnotBasicMaterial
);
torusKnotBasicMesh.castShadow = true;
torusKnotBasicMesh.receiveShadow = true;
torusKnotBasicMesh.position.set(2, 1, 0);
scene.add(torusKnotBasicMesh);

// ===========================================================================
// MeshDepthMaterial
const torusKnotDepthMaterial = new THREE.MeshDepthMaterial({ color: 0xffffff }); // 카메라와의 거리에 따라 색이 달라짐
torusKnotDepthMaterial.opacity = 0.5; // 투명도
const torusKnotDepthMesh = new THREE.Mesh(
  torusKnotGeometry,
  torusKnotDepthMaterial
);
torusKnotDepthMesh.castShadow = true;
torusKnotDepthMesh.receiveShadow = true;
torusKnotDepthMesh.position.set(4, 1, 0);
scene.add(torusKnotDepthMesh);

// 이미지파일을 texture로 불러오도록 하는 textureLoader
const textureLoader = new THREE.TextureLoader();
// load 함수와 콜백 이용
// textureLoader.load("/threejs.webp", (texture) => {
//   console.log(texture);
//   const texturetorusKnotGeometry = new THREE.torusKnotGeometry(1, 1, 1);
//   const textureMaterial = new THREE.MeshStandardMaterial({ map: texture });
//   const textureMesh = new THREE.Mesh(texturetorusKnotGeometry, textureMaterial);
//   textureMesh.castShadow = true;
//   textureMesh.receiveShadow = true;
//   textureMesh.position.z = 2;
//   scene.add(textureMesh);
// });

// loadAsync 함수 이용
const texture = await textureLoader.loadAsync('/threejs.webp');
const textureBoxGeometry = new THREE.BoxGeometry(1, 1, 1);
const textureMaterial = new THREE.MeshStandardMaterial({ map: texture });
const textureMesh = new THREE.Mesh(textureBoxGeometry, textureMaterial);
textureMesh.castShadow = true;
textureMesh.receiveShadow = true;
textureMesh.position.set(0, 0.5, 2);
scene.add(textureMesh);

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.update();

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
});

const render = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
  textureMesh.rotation.y += 0.01;
};

render();
