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

- [x] FPS 개념과 확인(stats)
      drei stats로 확인가능  
       FPS : 초당 렌더링되는 프레임수 (Frame Per Second) --> 높을수록  
       Millseconds per frame : 한 프레임을 렌더링하는데 걸리는 시간 --> 작을수록  
       Megabytes Used : 현재 웹페이지가 사용중인 메모리양  
       statsGL : CPU와 GPU를 나타냄
- [x] 최적화 알아보기 (DrawCall)
      frame 드랍이 일어나는 이유는 하드웨어가 처리할 수 있는 것보다 훨씬 더 큰 워크로드를 생성하는 그래픽 설정때문임

      CPU가 GPU에게 그려라 명령하는 것을 Draw Call이라고 함.
      보편적으로 상한치를 PC: 1000, Mobile : 100~200으로 잡음

##### 최적화 방안

1. 메시 병합 & Merged 컴퍼넌트
   여러 메시를 렌더링하기 보단 drei의 Merged컴퍼넌트를 이용해 합쳐서 렌더링하기
2. LOD(Level Of Detail)를 drei의 Detailed 컴퍼넌트로 적용
   세부 수준이 높은 모델을 멀리서 볼 때 줄이는 기술

- [x] Json 폰트 최적화
      기존 폰트 json파일을 사용하지 않는 glyph를 제거
- [x] Webp로 텍스처 압축
- [x] 모델 최적화 (glb, Draco 압축)
      draco : 구글에서 개발한 3d 그래픽 압축 라이브러리
      ex : car_taxi 를 압축해서 152kb에서 42kb로

```
npm install -g gltf-pipeline
gltf-pipeline -i car_taxi.glb -o car-taxi.glb -d
```
