"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import * as THREE from "three";
import {
  ADDITION,
  Brush,
  Evaluator,
  INTERSECTION,
  SUBTRACTION,
  DIFFERENCE,
} from "three-bvh-csg";

import { useLoading } from "./loadingContext";
import {
  EDITOR_STATE,
  FILE_EXTENSION,
  MESH_ACTIONS,
  MESH_TYPE,
  OPERATING_SYSTEM,
} from "../components/utils/constants";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { GammaCorrectionShader } from "three/addons/shaders/GammaCorrectionShader.js";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";
import { MapControls } from "three/addons/controls/MapControls.js";

import InfiniteGrid from "../components/canvas/InfiniteGrid";
import CustomControls from "../components/canvas/controls/CustomControls";
import ViewHelper from "../components/canvas/ViewHelper";
import { TransformControls } from "three/addons/controls/TransformControls.js";

import TextGeometry from "../components/canvas/TextGeometry";

import { TTFLoader } from "three/addons/loaders/TTFLoader.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";

import OutlinePass from "../components/canvas/postprocessing/OutlinePass";

const EditorContext = createContext();

export const useEditor = () => useContext(EditorContext);

export const EditorProvider = ({ children }) => {
  const [editorState, setEditorState] = useState(EDITOR_STATE.ALL_MOVEMENET);
  const [os, setOs] = useState("");
  const [isPreEditorLoaded, setIsPreEditorLoaded] = useState(false);
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);
  const [scene, setScene] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [lighting, setLighting] = useState(null);
  const [clock, setClock] = useState(null);

  const [camera, setCamera] = useState(null);
  const [cameraControls, setCameraControls] = useState(null);
  const [cameraViewHelper, setCameraViewHelper] = useState(null);
  const [transformControl, setTransformControl] = useState(null);
  const [editorWidth, setEditorWidth] = useState(null);
  const [editorHeight, setEditorHeight] = useState(null);
  const [targetMesh, setTargetMesh] = useState(null);

  const [raycaster, setRaycaster] = useState(null);
  const [pointer, setPointer] = useState(null);
  const [selectedMeshUuid, setSelectedMeshUuid] = useState(null);
  const [selectedMeshUuidsForAction, setSelectedMeshUuidsForAction] = useState(
    []
  );

  const [composer, setComposer] = useState(null);
  const [outlinePass, setOutlinePass] = useState(null);

  const [font, setFont] = useState(null);

  const { setIsLoading } = useLoading();

  useEffect(() => {
    setIsLoading(true);
    const _scene = new THREE.Scene();
    _scene.background = new THREE.Color(207 / 255, 206 / 255, 212 / 255, 1);
    const _renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    _renderer.setClearColor(0xffffff, 0);
    _renderer.autoClear = false;
    _renderer.sortObjects = false;
    _renderer.shadowMap.enabled = true;
    _renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const _camera = new THREE.PerspectiveCamera(75, 25 / 16, 0.1, 1000);
    _camera.setFocalLength(35);
    const _cameraControls = new CustomControls(_camera, _renderer.domElement);
    // const _cameraControls = new MapControls(_camera, _renderer.domElement);
    // const _cameraControls = new FirstPersonControls(
    //   _camera,
    //   _renderer.domElement
    // );
    // const _cameraControls = new OrbitControls(_camera, _renderer.domElement);

    const _cameraViewHelper = new ViewHelper(_camera, _renderer.domElement);
    _cameraViewHelper.controls = _cameraControls;
    _cameraViewHelper.controls.center = _cameraControls.target;

    const _raycaster = new THREE.Raycaster();
    const _pointer = new THREE.Vector2();
    const _clock = new THREE.Clock();

    // controls
    const _transformControl = new TransformControls(
      _camera,
      _renderer.domElement
    );

    // lighting
    const _ambientLight = new THREE.AmbientLight(0xededed);
    _ambientLight.intensity = 0.5;
    const _directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    _directionalLight.position.set(1, 10, 5);
    const _hemisphereLight = new THREE.HemisphereLight(0x006eff, 0xff00dd, 0.5);
    _hemisphereLight.position.set(0, 30, 0);
    _scene.add(_ambientLight, _directionalLight, _hemisphereLight);

    // grid base
    const infiniteGrid = new InfiniteGrid(
      1,
      5,
      new THREE.Color("#BFBEC2"),
      1000
    );
    _scene.add(infiniteGrid);

    // camera
    _camera.position.set(15, 10, 15);
    _camera.lookAt(new THREE.Vector3(0, 0, 0));

    // cameracontrol
    // _cameraControls.lookAt(0, 0, 0);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    _scene.add(cube);

    setOperatingSystem();
    setScene(_scene);
    setRenderer(_renderer);
    setCamera(_camera);
    setCameraControls(_cameraControls);
    setCameraViewHelper(_cameraViewHelper);
    setRaycaster(_raycaster);
    setPointer(_pointer);
    setClock(_clock);
    setTransformControl(_transformControl);
    // setTargetMesh(_targetMesh)

    loadFont();

    setIsPreEditorLoaded(true);
    // setIsEditorLoaded(true);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isPreEditorLoaded || !scene) return;
    // re-new transformControl
    transformControl.detach();
    scene.add(transformControl);

    const target = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        type: THREE.HalfFloatType,
        format: THREE.RGBAFormat,
        colorSpace: renderer.outputColorSpace,
      }
    );
    target.samples = 8;

    // postprocessing
    const _composer = new EffectComposer(renderer, target);
    const renderPass = new RenderPass(scene, camera);
    renderPass.clearAlpha = 0;

    _composer.addPass(renderPass);

    const _outlinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      scene,
      camera
    );
    _outlinePass.edgeThickness = 1.5;
    _outlinePass.edgeStrength = 3;
    _outlinePass.visibleEdgeColor = new THREE.Color("#C15CFF");
    _outlinePass.hiddenEdgeColor = new THREE.Color("#C15CFF");
    _outlinePass.pulsePeriod = 0;
    _outlinePass.overlayMaterial.blending = THREE.CustomBlending;
    _composer.addPass(_outlinePass);

    const _gammaCorrection = new ShaderPass(GammaCorrectionShader);
    _composer.addPass(_gammaCorrection);

    setComposer(_composer);
    setOutlinePass(_outlinePass);
    setIsEditorLoaded(true);
  }, [scene, isPreEditorLoaded]);

  // change controls by editorState && outlinePass
  useEffect(() => {
    if (!isEditorLoaded) {
      return;
    }
    outlinePass.selectedObjects = [
      ...selectedMeshUuidsForAction.map((_uuid) =>
        scene.getObjectByProperty("uuid", _uuid)
      ),
    ];
  }, [selectedMeshUuidsForAction]);

  useEffect(() => {
    if (!isEditorLoaded) {
      return;
    }
    if (editorState === EDITOR_STATE.SELECTION) {
      transformControl.enabled = false;
      transformControl.showX = false;
      transformControl.showY = false;
      transformControl.showZ = false;
    } else {
      transformControl.enabled = true;
      transformControl.showX = true;
      transformControl.showY = true;
      transformControl.showZ = true;
      transformControl.setMode(editorState);
    }
  }, [editorState]);

  // Add shortcuts after editorLoaded completed
  useEffect(() => {
    if (!isEditorLoaded) return;
    document.addEventListener("keydown", shortCutHandler);

    return () => {
      document.removeEventListener("keydown", shortCutHandler);
    };
  }, [isEditorLoaded, selectedMeshUuidsForAction]);

  const setOperatingSystem = () => {
    const _appVersion = window.navigator.appVersion;
    if (_appVersion.indexOf("Win") !== -1) {
      setOs(OPERATING_SYSTEM.WINDOW);
      return;
    } else if (_appVersion.indexOf("Mac") !== -1) {
      setOs(OPERATING_SYSTEM.MAC);
      return;
    } else if (_appVersion.indexOf("X11") !== -1) {
      setOs(OPERATING_SYSTEM.UNIX);
      return;
    } else if (_appVersion.indexOf("Linux") !== -1) {
      setOs(OPERATING_SYSTEM.LINUX);
      return;
    }
  };

  const shortCutHandler = (event) => {
    const isMac = os === OPERATING_SYSTEM.MAC;
    const { shiftKey, metaKey, ctrlKey, code } = event;
    const ctrlKeyByOs = isMac ? metaKey : ctrlKey;

    if (!shiftKey && ctrlKeyByOs && code === "Digit1") {
      event.preventDefault();
      setEditorState(EDITOR_STATE.SELECTION);
    } else if (!shiftKey && ctrlKeyByOs && code === "Digit2") {
      event.preventDefault();
      setEditorState(EDITOR_STATE.MOVEMENT);
    } else if (!shiftKey && ctrlKeyByOs && code === "Digit3") {
      event.preventDefault();
      setEditorState(EDITOR_STATE.ROTATION);
    } else if (!shiftKey && ctrlKeyByOs && code === "Digit4") {
      event.preventDefault();
      setEditorState(EDITOR_STATE.SCALE);
    } else if (!shiftKey && ctrlKeyByOs && code === "Digit5") {
      event.preventDefault();
      setEditorState(EDITOR_STATE.ALL_MOVEMENET);
    } else if (!shiftKey && ctrlKeyByOs && code === "KeyQ") {
      event.preventDefault();
    } else if (!shiftKey && ctrlKeyByOs && code === "KeyW") {
      event.preventDefault();
    } else if (!shiftKey && ctrlKeyByOs && code === "KeyD") {
      event.preventDefault();
    } else if (shiftKey && ctrlKeyByOs && code === "KeyG") {
      event.preventDefault();
      actionsOnMeshs(MESH_ACTIONS.UNION);
    } else if (shiftKey && ctrlKeyByOs && code === "KeyI") {
      event.preventDefault();
      actionsOnMeshs(MESH_ACTIONS.INTERSECTION);
    } else if (shiftKey && ctrlKeyByOs && code === "KeyD") {
      event.preventDefault();
      actionsOnMeshs(MESH_ACTIONS.DIFFERENCE);
    } else if (code === "Backspace" || code === "Delete") {
      event.preventDefault();
      deleteSelectedMesh();
    } else if (code === "Escape") {
      event.preventDefault();
      setSelectedMeshUuidsForAction([]);
    }
  };

  const loadFont = (fileLocation = "../fonts/ttf/Inter/Inter-Black.ttf") => {
    const loader = new TTFLoader();
    loader.load(
      fileLocation,
      function (response) {
        const fontLoader = new FontLoader();
        const _font = fontLoader.parse(response);
        console.log(_font);
        setFont(_font);
      },
      null,
      function () {
        return;
      }
    );
  };

  const getOnlyMeshsFromScene = () => {
    if (!isEditorLoaded) {
      return [];
    }

    const _meshs = scene?.children.filter((_mesh) => {
      if (
        _mesh?.isInfiniteGrid ||
        _mesh?.isTransformControls ||
        _mesh?.isLight ||
        _mesh?.isViewHelper
      ) {
        return false;
      }
      return true;
    });

    return _meshs;
  };

  const addMesh = (meshType) => {
    let geometry;
    let material;
    switch (meshType) {
      case MESH_TYPE.BOX2:
        geometry = new THREE.PlaneGeometry(1, 1);
        break;
      case MESH_TYPE.BOX3:
        geometry = new THREE.BoxGeometry(4, 4, 4, 50, 50, 50);
        break;
      case MESH_TYPE.CIRCLE2:
        geometry = new THREE.CircleGeometry(1, 64);
        break;
      case MESH_TYPE.CIRCLE3:
        geometry = new THREE.SphereGeometry(1, 64, 64);
        break;
      case MESH_TYPE.CONE:
        geometry = new THREE.ConeGeometry(1, 2, 64);
        break;
      case MESH_TYPE.CYLINDER:
        geometry = new THREE.CylinderGeometry(1, 1, 2, 64);
        break;
      case MESH_TYPE.TORUS:
        geometry = new THREE.TorusGeometry(2, 1, 64, 128);
        break;
      case MESH_TYPE.ICOSAHEDRON:
        geometry = new THREE.IcosahedronGeometry();
        break;
      case MESH_TYPE.TEXT: {
        geometry = new TextGeometry("Hello Editor!", {
          font,
          size: 1,
          height: 0,
          curveSegments: 4,
          bevelThickness: 1,
          bevelSize: 0,
          bevelSegments: 0,
          bevelEnabled: true,
        });
        break;
      }
      default:
        geometry = new THREE.BoxGeometry(1, 1, 1);
        break;
    }
    // centeringGeometry(geometry);

    material = new THREE.MeshStandardMaterial({
      roughness: 1,
      metalness: 0,
      color: new THREE.Color("red"),
      // vertexColors: true,
      side:
        meshType === MESH_TYPE.BOX2 || meshType === MESH_TYPE.CIRCLE2
          ? THREE.DoubleSide
          : null,
    });

    // centering for text
    centeringGeometry(geometry);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    mesh.name = [...meshType]
      .map((alphm, index) => (index ? alphm : alphm.toUpperCase()))
      .join("");

    scene.add(mesh);

    transformControl.attach(mesh);
    // scene.add(transformControl);
    transformControl.enabled = true;
    transformControl.showX = true;
    transformControl.showY = true;
    transformControl.showZ = true;
  };

  const centeringGeometry = (
    _geometry,
    centerX = true,
    centerY = true,
    centerZ = true
  ) => {
    _geometry.computeBoundingSphere();
    const dx = centerX ? -1 * _geometry.boundingSphere.center.x : 0;
    const dy = centerY ? -1 * _geometry.boundingSphere.center.y : 0;
    const dz = centerZ ? -1 * _geometry.boundingSphere.center.z : 0;
    _geometry.translate(dx, dy, dz);
  };

  const exportModel = async () => {
    const exporter = new GLTFExporter();

    const filename = `model.gltf`;

    try {
      const objects = getOnlyMeshsFromScene();
      exporter.parse(
        objects,
        // called when the gltf has been generated
        function (file) {
          downloadJSON(file, filename);
        },
        // called when there is an error in the generation
        function (error) {
          Logger.error("An error happened", error);
        },
        // options
        { binary: false }
      );
    } catch (e) {
      Logger.log("Error happened", e);
    }
  };

  const downloadJSON = (file, filename) => {
    const link = document.createElement("a");
    link.style.display = "none";
    document.body.appendChild(link);
    link.href = URL.createObjectURL(
      new Blob([JSON.stringify(file)], { type: "application/json" })
    );
    link.download = filename;
    link.click();
  };

  const importModel = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const extension = file.name.split(".")[file.name.split(".").length - 1];
    if (!extension) {
      return;
    }

    const url = URL.createObjectURL(file);
    loadFile(extension, url);
    event.target.value = "";
  };

  const loadFile = (extension, url) => {
    let loader;
    switch (extension) {
      case FILE_EXTENSION.FBX:
        loader = new FBXLoader();
        break;
      case FILE_EXTENSION.GLTF:
        loader = new GLTFLoader();
        break;
      default:
        loader = new FBXLoader();
        break;
    }

    loader.load(
      url,
      function (model) {
        console.log("==>model", extension, model);
        let _object = model;
        if (extension === FILE_EXTENSION.GLTF) {
          _object = model.scene;
        }

        if (_object?.children.length) {
          _object.children.map((_obj) => {
            _obj.traverse((child) => {
              child.receiveShadow = true;
              child.castShadow = true;
              child.visible = true;
              child.frustumCulled = false;
              child.updateMatrixWorld();
            });
          });
        } else {
          _object.receiveShadow = true;
          _object.castShadow = true;
        }

        scene.add(_object);
        setIsLoading(false);
      },
      undefined,
      function (e) {
        console.log("error", e);
        setIsLoading(false);
      }
    );
  };

  const handleSelectedMesh = (_uuid, type = "single") => {
    // if (!transformControl.allowOutsideActions) return;
    const _mesh = scene.getObjectByProperty("uuid", _uuid);
    transformControl.attach(_mesh);
    if (type === "single") {
      setSelectedMeshUuidsForAction([_uuid]);
    } else {
      // for actions
      setSelectedMeshUuidsForAction((prev) => {
        let _prev = JSON.parse(JSON.stringify(prev));
        let _idx = _prev.indexOf(_uuid);
        if (_idx > -1) {
          let newArr = [..._prev].filter((item) => item !== _uuid);
          return [...newArr];
        } else {
          let newArr = [..._prev, _uuid];
          return [...newArr];
        }
      });
    }
  };

  const disposeSelectedMeshs = () => {
    setSelectedMeshUuidsForAction([]);
  };

  const deleteMeshByMesh = (_mesh) => {
    if (!_mesh) return;
    outlinePass.selectedObjects = [];
    _mesh?.traverse((child) => {
      if (child?.geometry) child?.geometry?.dispose();
      if (child?.material) {
        child?.material.length
          ? child?.material.map((item) => {
              item.dispose();
            })
          : child?.material?.dispose();
      }
    });
    transformControl.detach();
    setSelectedMeshUuidsForAction([
      ...selectedMeshUuidsForAction.filter((item) => {
        item !== _mesh.uuid;
      }),
    ]);
    if (_mesh.parent !== null) {
      _mesh.parent.remove(_mesh);
    } else {
      scene.remove(_mesh);
    }
  };

  const deleteSelectedMesh = () => {
    if (selectedMeshUuidsForAction.length !== 1) {
      return;
    }
    const _mesh = scene.getObjectByProperty(
      "uuid",
      selectedMeshUuidsForAction[0]
    );
    deleteMeshByMesh(_mesh);
  };

  const deleteMeshs = (_meshs) => {
    _meshs.map((_mesh) => {
      deleteMeshByMesh(_mesh, false);
    });
  };

  const intoBrush = (_mesh) => {
    let brush;
    const csgEvaluator = new Evaluator();
    csgEvaluator.attributes = ["position", "normal", "color", "uv"];
    csgEvaluator.useGroups = true;
    csgEvaluator.consolidateGroups = true;
    const initPosition = _mesh?.isGroup ? _mesh.position : { x: 0, y: 0, z: 0 };
    _mesh.traverse((child) => {
      if (child?.isMesh) {
        brush = brush
          ? csgEvaluator.evaluate(
              brush,
              meshToBrush(child, initPosition),
              ADDITION
            )
          : meshToBrush(child, initPosition);
      }
    });
    return brush;
  };

  const actionsOnMeshs = (action) => {
    if (selectedMeshUuidsForAction.length < 2) {
      return;
    }
    transformControl.detach();
    const _mesh1 = scene.getObjectByProperty(
      "uuid",
      selectedMeshUuidsForAction[selectedMeshUuidsForAction.length - 2]
    );
    const _mesh2 = scene.getObjectByProperty(
      "uuid",
      selectedMeshUuidsForAction[selectedMeshUuidsForAction.length - 1]
    );

    let newMesh = new THREE.Mesh(
      new THREE.BufferGeometry(),
      new THREE.MeshStandardMaterial({
        roughness: 0.1,
        flatShading: false,
        polygonOffset: true,
        polygonOffsetUnits: 1,
        polygonOffsetFactor: 1,
      })
    );
    let firstBrush;
    let finalBrush;
    let newBrush;
    const csgEvaluator = new Evaluator();
    csgEvaluator.useGroups = true;
    csgEvaluator.consolidateGroups = true;
    csgEvaluator.attributes = ["position", "normal"];

    switch (action) {
      case MESH_ACTIONS.UNION: {
        firstBrush = intoBrush(_mesh1);
        finalBrush = intoBrush(_mesh2);
        newBrush = csgEvaluator.evaluate(firstBrush, finalBrush, ADDITION);
        newMesh.geometry = newBrush.geometry;
        newMesh.material = newBrush.material;
        break;
      }
      case MESH_ACTIONS.INTERSECTION:
        firstBrush = intoBrush(_mesh1);
        finalBrush = intoBrush(_mesh2);
        newBrush = csgEvaluator.evaluate(firstBrush, finalBrush, INTERSECTION);
        newMesh.geometry = newBrush.geometry;
        newMesh.material = newBrush.material;
        break;
      case MESH_ACTIONS.NEGATE:
        firstBrush = intoBrush(_mesh1);
        finalBrush = intoBrush(_mesh2);
        newBrush = csgEvaluator.evaluate(firstBrush, finalBrush, SUBTRACTION);
        newMesh.geometry = newBrush.geometry;
        newMesh.material = newBrush.material;
        break;
      case MESH_ACTIONS.DIFFERENCE:
        firstBrush = intoBrush(_mesh1);
        finalBrush = intoBrush(_mesh2);
        newBrush = csgEvaluator.evaluate(firstBrush, finalBrush, DIFFERENCE);
        newMesh.geometry = newBrush.geometry;
        newMesh.material = newBrush.material;
        break;
      default:
        break;
    }
    newMesh.geometry.computeBoundingBox();
    newMesh.geometry.computeBoundingSphere();
    const _localCenter = newMesh.geometry.boundingSphere.center.clone();
    newMesh.geometry.center();
    newMesh.position.set(_localCenter.x, _localCenter.y, _localCenter.z);
    deleteMeshs([_mesh1, _mesh2]);
    scene.add(newMesh);
  };

  const meshToBrush = (_mesh, _initPosition = { x: 0, y: 0, z: 0 }) => {
    _mesh.geometry.computeVertexNormals();
    const _tmp = _mesh.clone(true);
    const _tmpGeo = _mesh.geometry;
    const _tmpMatarial = _mesh.material;
    const _worldPosition = new THREE.Vector3();
    _mesh.getWorldPosition(_worldPosition);
    const _worldScale = new THREE.Vector3();
    _mesh.getWorldScale(_worldScale);
    const _worldQuaternion = new THREE.Quaternion();
    _mesh.getWorldQuaternion(_worldQuaternion);

    let brush = new Brush(_tmpGeo, _tmpMatarial);
    brush.rotation.setFromQuaternion(_worldQuaternion);
    brush.scale.set(_worldScale.x, _worldScale.y, _worldScale.z);
    brush.position.set(_worldPosition.x, _worldPosition.y, _worldPosition.z);
    brush.matrix = _tmp?.matrix;
    brush.matrixWorld = _tmp?.matrixWorld;
    brush.matrixWorldNeedsUpdate = true;
    brush.updateMatrixWorld();
    return brush;
  };

  return (
    <EditorContext.Provider
      value={{
        isEditorLoaded,
        scene,
        renderer,
        lighting,
        clock,
        camera,
        cameraControls,
        cameraViewHelper,
        transformControl,
        editorState,
        raycaster,
        pointer,
        setEditorState,
        addMesh,
        exportModel,
        importModel,
        setEditorHeight,
        setEditorWidth,
        getOnlyMeshsFromScene,
        handleSelectedMesh,
        disposeSelectedMeshs,
        composer,
        outlinePass,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
