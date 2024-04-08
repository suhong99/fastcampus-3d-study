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

const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0xbbbbbb,
  side: THREE.DoubleSide,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; //-90도 회전
floor.receiveShadow = true;
floor.castShadow = true;
scene.add(floor);

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
boxMesh.castShadow = true;
boxMesh.receiveShadow = true;
boxMesh.position.y = 0.5;
scene.add(boxMesh);

// 카메라 위치의 z 좌표 변경
// camera.position.z = 5;
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

// 화면 사이즈가 변경될 때
window.addEventListener('resize', () => {
  // 카메라의 가로세로 비율을 바뀐 비율로 재설정
  camera.aspect = window.innerWidth / window.innerHeight;

  // 위에서 바뀐 속성 정보 적용
  camera.updateProjectionMatrix();

  // renderer에도 바뀐 가로 세로 사이즈 적용
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 바뀐 상태로 리랜더
  renderer.render(scene, camera);
});

// 그람자 없음 : AmbientLight , HemisphereLight, RectAreaLight
// 그림자 있음 : DirectionalLight , PointLight , SpotLight

/////////
// // AmbientLight
// // ==> 모든 장면에 동일한 밝기를 제공함
// // ==> 그림자 X
// const ambientLight = new THREE.AmbientLight(0xffffff, 5);
// scene.add(ambientLight);

// // DirectionalLight
// // ==> 직사광선(태양 빛을 연상하면 됨)
// // ==> 그림자 O
// const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
// directionalLight.castShadow = true; // 빛이 그림자를 만들 수 있게 함
// directionalLight.position.set(3, 4, 5); // 빛의 위치 설정
// directionalLight.lookAt(0, 0, 0); // 빛이 향하는 방향 설정
// scene.add(directionalLight);
// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight,
//   1
// );
// scene.add(directionalLightHelper);

// // HemisphereLight
// // ==> 반구 모양의 조명(노을을 연상하면 됨)
// // ==> 그림자 X
// boxMaterial.color = new THREE.Color(0xffffff);
// const hemisphereLight = new THREE.HemisphereLight(0xb4a912, 0x12f34f, 5); // 위쪽 색, 아래쪽 색, 강도
// hemisphereLight.position.set(0, 1, 0);
// hemisphereLight.lookAt(0, 0, 0);
// scene.add(hemisphereLight);
// boxMesh.position.y = 2;
// floorMaterial.side = THREE.DoubleSide;
// const hemisphereLightHelper = new THREE.HemisphereLightHelper(
//   hemisphereLight,
//   2,
//   0x000000
// );
// scene.add(hemisphereLightHelper);

// // PointLight
// // ==> 점 모양의 조명(구 모양의 무드등을 연상하면 됨)
// // ==> 그림자 O
// const pointLight = new THREE.PointLight(0xffffff, 5, 3, 2); // 색상, 강도, 빛의 도달 최대 거리, 거리에 따라 희미해지는 정도
// pointLight.castShadow = true;
// pointLight.position.set(1, 1, 1); // 빛의 위치를 설정
// scene.add(pointLight);
// const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
// scene.add(pointLightHelper);

// // RectAreaLight
// // ==> 사각형 판 모양의 조명(빛이 나는 네모난 모양의 간판을 연상하면 됨)
// // ==> 그림자 X
// // ==> MeshStandardMaterial과 MeshPhysicalMaterial만 이 빛의 영향을 받음
// const rectAreaLight = new THREE.RectAreaLight(0xffffff, 5, 2, 2); // 색상, 강도, 조명의 가로 너비, 조명의 세로 길이
// // rectAreaLight.rotation.x = -Math.PI / 2;
// rectAreaLight.position.set(0, 1, 2); // 위치 설정
// scene.add(rectAreaLight);

// SpotLight
// ==> 스포트라이트(공연 무대에서 주인공을 비추는 조명을 연상하면 됨)
// ==> 그림자 O
// ==> 빛의 방향을 조정하려면 scene 상의 오브젝트를 이 조명의 target으로 삼고, 해당 조명의 위치를 통해 조정함
const targetObj = new THREE.Object3D();
scene.add(targetObj);
const spotLight = new THREE.SpotLight(0xffffff, 10, 100, Math.PI / 4, 1, 1);
spotLight.castShadow = true;
spotLight.target = targetObj;
spotLight.position.set(0, 3, 0);
spotLight.target.position.set(1, 0, 2);
boxMaterial.color = new THREE.Color(0xff0000);
scene.add(spotLight);

const lightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(lightHelper);

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
};

render();
