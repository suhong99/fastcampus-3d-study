import {
  BoxGeometry,
  SphereGeometry,
  CanvasTexture,
  Color,
  Euler,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  OrthographicCamera,
  Quaternion,
  Raycaster,
  Sprite,
  SpriteMaterial,
  Vector2,
  Vector3,
  Vector4,
  BackSide,
  DoubleSide,
} from "three";

class ViewHelper extends Object3D {
  constructor(camera, domElement) {
    super();
    this.domElement = domElement;
    this.isViewHelper = true;

    this.animating = false;
    this.center = new Vector3();
    this.controls = null;

    const RED = new Color("#E0133F");
    const GREEN = new Color("#0AC06D");
    const BLUE = new Color("#2146FF");
    const GRAY = new Color("#8E919D");

    const interactiveObjects = [];
    const raycaster = new Raycaster();
    const mouse = new Vector2();
    const dummy = new Object3D();

    // 원근감을 없앤 카메라
    const orthoCamera = new OrthographicCamera(-2, 2, 2, -2, 0, 4);
    orthoCamera.position.set(0, 0, 2);

    const geometry = new BoxGeometry(0.8, 0.05, 0.05).translate(0.4, 0, 0);
    const backgroundGeo = new SphereGeometry(1.6);
    const background = new Mesh(
      backgroundGeo,
      new MeshBasicMaterial({
        color: 0xffffff,
        side: DoubleSide,
        transparent: true,
        opacity: 0.2,
        depthTest: false,
      })
    );

    const xAxis = new Mesh(geometry, getAxisMaterial(RED));
    const yAxis = new Mesh(geometry, getAxisMaterial(GREEN));
    const zAxis = new Mesh(geometry, getAxisMaterial(BLUE));

    yAxis.rotation.z = Math.PI / 2;
    zAxis.rotation.y = -Math.PI / 2;

    this.add(xAxis);
    this.add(zAxis);
    this.add(yAxis);

    const posXAxisHelper = new Sprite(getSpriteMaterial(RED));
    posXAxisHelper.userData.type = "posX";
    const posYAxisHelper = new Sprite(getSpriteMaterial(GREEN));
    posYAxisHelper.userData.type = "posY";
    const posZAxisHelper = new Sprite(getSpriteMaterial(BLUE));
    posZAxisHelper.userData.type = "posZ";
    const negXAxisHelper = new Sprite(getSpriteMaterial(GRAY));
    negXAxisHelper.userData.type = "negX";
    const negYAxisHelper = new Sprite(getSpriteMaterial(GRAY));
    negYAxisHelper.userData.type = "negY";
    const negZAxisHelper = new Sprite(getSpriteMaterial(GRAY));
    negZAxisHelper.userData.type = "negZ";

    posXAxisHelper.position.x = 1;
    posYAxisHelper.position.y = 1;
    posZAxisHelper.position.z = 1;
    negXAxisHelper.position.x = -1;
    negXAxisHelper.scale.setScalar(0.8);
    negYAxisHelper.position.y = -1;
    negYAxisHelper.scale.setScalar(0.8);
    negZAxisHelper.position.z = -1;
    negZAxisHelper.scale.setScalar(0.8);

    this.add(background);
    this.add(posXAxisHelper);
    this.add(posYAxisHelper);
    this.add(posZAxisHelper);
    this.add(negXAxisHelper);
    this.add(negYAxisHelper);
    this.add(negZAxisHelper);

    interactiveObjects.push(posXAxisHelper);
    interactiveObjects.push(posYAxisHelper);
    interactiveObjects.push(posZAxisHelper);
    interactiveObjects.push(negXAxisHelper);
    interactiveObjects.push(negYAxisHelper);
    interactiveObjects.push(negZAxisHelper);

    const point = new Vector3();
    const dim = 128;
    const turnRate = 2 * Math.PI; // turn rate in angles per second

    this.render = function (renderer) {
      this.quaternion.copy(camera.quaternion).invert();
      this.updateMatrixWorld();

      point.set(0, 0, 1);
      point.applyQuaternion(camera.quaternion);

      const x = domElement.offsetWidth - dim;
      const y = domElement.offsetHeight - dim;

      renderer.clearDepth();

      renderer.getViewport(viewport);
      renderer.setViewport(x, y, dim, dim);

      renderer.render(this, orthoCamera);

      renderer.setViewport(viewport.x, viewport.y, viewport.z, viewport.w);
    };

    const targetPosition = new Vector3();
    const targetQuaternion = new Quaternion();

    const q1 = new Quaternion();
    const q2 = new Quaternion();
    const viewport = new Vector4();
    let radius = 0;

    this.onPointerMove = function (event) {
      if (this.domElement !== document) {
        this.domElement.focus();
      }
      const rect = domElement.getBoundingClientRect();
      const offsetX = rect.left + (domElement.offsetWidth - dim);
      const offsetY = rect.top;
      mouse.x = ((event.clientX - offsetX) / (rect.right - offsetX)) * 2 - 1;
      mouse.y = -1 * (((event.clientY - offsetY) / dim) * 2 - 1);
      raycaster.setFromCamera(mouse, orthoCamera);

      const intersects = raycaster.intersectObjects(interactiveObjects);

      if (intersects.length > 0) {
        this.domElement.style.cursor = "pointer";
      } else {
        this.domElement.style.cursor = "default";
      }
    };

    this.handleClick = function (event) {
      if (this.animating === true) return false;

      const rect = domElement.getBoundingClientRect();
      const offsetX = rect.left + (domElement.offsetWidth - dim);
      const offsetY = rect.top;
      mouse.x = ((event.clientX - offsetX) / (rect.right - offsetX)) * 2 - 1;
      mouse.y = -1 * (((event.clientY - offsetY) / dim) * 2 - 1);

      raycaster.setFromCamera(mouse, orthoCamera);

      const intersects = raycaster.intersectObjects(interactiveObjects);

      if (intersects.length > 0) {
        const intersection = intersects[0];
        const object = intersection.object;
        prepareAnimationData(object, this.center);

        this.animating = true;
        return true;
      } else {
        return false;
      }
    };

    this.update = function (delta) {
      if (!this.animating) return;
      const step = delta * turnRate;

      // animate position by doing a slerp and then scaling the position on the unit sphere\
      q1.rotateTowards(q2, step);
      camera.position
        .set(0, 0, 1)
        .applyQuaternion(q1)
        .multiplyScalar(radius)
        .add(this.center);

      // animate orientation
      camera.quaternion.rotateTowards(targetQuaternion, step);
      if (q1.angleTo(q2) === 0) {
        this.animating = false;
      }
    };

    this.dispose = function () {
      geometry.dispose();

      xAxis.material.dispose();
      yAxis.material.dispose();
      zAxis.material.dispose();

      posXAxisHelper.material.map.dispose();
      posYAxisHelper.material.map.dispose();
      posZAxisHelper.material.map.dispose();
      negXAxisHelper.material.map.dispose();
      negYAxisHelper.material.map.dispose();
      negZAxisHelper.material.map.dispose();

      posXAxisHelper.material.dispose();
      posYAxisHelper.material.dispose();
      posZAxisHelper.material.dispose();
      negXAxisHelper.material.dispose();
      negYAxisHelper.material.dispose();
      negZAxisHelper.material.dispose();

      this.domElement.removeEventListener("pointermove", _onPointerMove);
    };

    function prepareAnimationData(object, focusPoint) {
      switch (object.userData.type) {
        case "posX":
          targetPosition.set(1, 0, 0);
          targetQuaternion.setFromEuler(new Euler(0, Math.PI * 0.5, 0));
          break;

        case "posY":
          targetPosition.set(0, 1, 0);
          targetQuaternion.setFromEuler(new Euler(-Math.PI * 0.5, 0, 0));
          break;

        case "posZ":
          targetPosition.set(0, 0, 1);
          targetQuaternion.setFromEuler(new Euler());
          break;

        case "negX":
          targetPosition.set(-1, 0, 0);
          targetQuaternion.setFromEuler(new Euler(0, -Math.PI * 0.5, 0));
          break;

        case "negY":
          targetPosition.set(0, -1, 0);
          targetQuaternion.setFromEuler(new Euler(Math.PI * 0.5, 0, 0));
          break;

        case "negZ":
          targetPosition.set(0, 0, -1);
          targetQuaternion.setFromEuler(new Euler(0, Math.PI, 0));
          break;

        default:
          console.error("ViewHelper: Invalid axis.");
      }

      //

      radius = camera.position.distanceTo(focusPoint);
      targetPosition.multiplyScalar(radius).add(focusPoint);

      dummy.position.copy(focusPoint);

      dummy.lookAt(camera.position);
      q1.copy(dummy.quaternion);

      dummy.lookAt(targetPosition);
      q2.copy(dummy.quaternion);
    }

    function getAxisMaterial(color) {
      return new MeshBasicMaterial({
        color: color,
        toneMapped: false,
        transparent: true,
        opacity: 0.8,
      });
    }

    function getSpriteMaterial(color) {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;

      const context = canvas.getContext("2d");
      context.beginPath();
      context.arc(32, 32, 16, 0, 2 * Math.PI);
      context.closePath();
      context.fillStyle = color.getStyle();
      context.fill();

      const texture = new CanvasTexture(canvas);

      return new SpriteMaterial({
        map: texture,
        toneMapped: false,
        transparent: true,
      });
    }

    const _onPointerMove = this.onPointerMove.bind(this);
    const _onPointerClick = this.handleClick.bind(this);

    this.domElement.addEventListener("pointermove", _onPointerMove);
    this.domElement.addEventListener("pointerClick", _onPointerClick);
  }
}

export default ViewHelper;
