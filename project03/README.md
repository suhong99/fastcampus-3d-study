# 3D 인터랙티브 웹 개발 분야 이론 및 실습 강의 / 파트3

# 3D 물리엔진 자동차 웹

## 3D 개발 환경 구현

- [x] 프로젝트 설명 (r3f, cannon)
- [x] use-cannon 라이브러리 소개
      cannon : 물리엔진을 만들어주는 라이브러리 (rapier, p2도 잇음)ㅇ
- [x] leva 라이브러리 소개
      gui로 옵션을 제어할 수 있어서 개발 효율성을 높일 수 있음
- [x] 물리 엔진 기본 1편 (useBox, useShpere, useCylinder, usePlane )
- [x] 물리 엔진 기본 2편 (useTrimesh, useConvexPolyhedron )

## Cannon 활용 자동차 구현

- [x] 물리 엔진을 가진 자동차의 바디 만들기 (useBox)
- [x] 물리 엔진을 가진 바퀴 만들기 (useCompoundBody)  
       여러개의 간단한 형태의 물체를 조합하여 하나의 복잡한 물체를 만들 수 있음
- [x] 키보드를 통한 바퀴 제어 로직 만들기
      레이싱카 로직을 쉽게 구현하는 useRaycastVehicle훅 사용
- [x] 물리엔진 Static, Kinematic, Dynamic 이해하기
      static : 움직이지 않음 (벽)  
       Kineitc : 사용자가 조종하는 대상 혹은 물리 시뮬레이션에 영향을 받지 않는 대상  
       Dynamic : 물리 시뮬레이션에 영향을 받는 대상(공)
- [x] useBox, useSphere로 충돌체 만들기 구체, 박스 (Dynamic)
- [x] 벽과 고정체 만들기 (Static)
- [x] 자동차를 따라다니는 카메라 만들기 (useThree)
      기본 렌더러, 씬, 카메라 등이 포함된 상태 모델에 접근할 수 있게 해줌.  
       현재 캔버스의 크기를 스크린 및 뷰포트 좌표로 제공함
      --> useFollowCam 훅

## 3D 오브젝트 실제 모델 적용하기

- [x] gltfjsx로 소개 및 glb 파일을 jsx로 변환하기
      gltf를 선언적이고 재사용 가능한 r3f jsx 컴포넌트로 변환시켜주는 유틸리티  
       장점 : 쉬운 콘텐츠 수정 및 재사용성, 효율적인 그래프 최적화, 압축 옵션 제공  
       npx gltfjsx car_taxi.glb --output ./CarBody.jsx

- [x] 자동차 바디 glb 모델로 적용하기
- [x] 자동차 바퀴 glb 모델로 적용하기
- [x] 충돌 모델 glb 모델로 적용하기
- [x] Text 3D 모델 넣기

## 이벤트 및 모션 만들기

- [x] recoil 전역값 관리 학습
- [x] 페이지 진입시 인 모션 만들기
      motion의 onUpdate, onAnimationStart, onAnimationComplete로 함수 실행
- [x] 물체 충돌 UI 팝업 생성
      충돌 그룹을 사용하여 다양한 개체의 상호작용 관리
- [x] 물체 충돌시 물체 회전 (간판 회전)
- [x] 물체 마우스 클릭시 페이지 이동
      useTexture로 물체에 이미지 입히기
- [x] 특정 지역 진입시 이벤트 발생
- [x] 특정 지역 진입시 이벤트2 발생

## 프로젝트 최적화 알아보기

- [ ] FPS 개념과 확인(stats)
- [ ] 최적화 알아보기 (DrawCall)
- [ ] Json 폰트 최적화
- [ ] Webp로 텍스처 압축
- [ ] 모델 최적화 (glb, Draco 압축)

[완성본 링크] - (https://mr-chu-car-web.netlify.app/)
