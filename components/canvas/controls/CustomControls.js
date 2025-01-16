import {
  MathUtils,
  Spherical,
  Vector3,
  Vector2,
  Euler,
  Matrix3,
  Raycaster,
} from "three";

const _lookDirection = new Vector3();
const _spherical = new Spherical();
const _target = new Vector3();
const _euler = new Euler(0, 0, 0, "YXZ");
const _PI_2 = Math.PI / 2;

let scrollTimeout;

// EXPLANATION: 그냥 임의로 만들어놓은 지표
const FAST = 40;
const NORMAL = 10;
const SLOW = 4;
const WHEEL_SENSITIVITY = 4;

// OrbitControls & FirstPersonControls를 기반으로 신규 CustomControls
class CustomControls {
  constructor(object, domElement) {
    this.object = object;
    this.domElement = domElement;

    // API

    this.enabled = true;

    this.movementSpeed = NORMAL;
    this.lookSpeed = 0.2;

    this.lookVertical = true;
    this.autoForward = false;

    this.activeLook = true;

    this.heightSpeed = false;
    this.heightCoef = 1.0;
    this.heightMin = 0.0;
    this.heightMax = 1.0;

    this.constrainVertical = false;
    this.verticalMin = 0;
    this.verticalMax = Math.PI;
    this.center = new Vector3();
    this.position = this.object.position;

    // internals

    this.autoSpeedFactor = 0.0;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;

    this.viewHalfX = 0;
    this.viewHalfY = 0;

    this.changeAngle = false;
    this.dragMap = false;

    this.zoom = 0;

    this.minPolarAngle = 0; // radians
    this.maxPolarAngle = Math.PI; // radians

    this.pointerSpeed = 3.0;
    this.panSpeed = 0.005;

    // private variables

    let lat = 0;
    let lon = 0;
    let center = this.center;
    let pointer = new Vector2();
    let pointerOld = new Vector2();
    let delta = new Vector3();
    let normalMatrix = new Matrix3();
    let raycaster = new Raycaster();

    // FirstPersonControls
    this.handleResize = function () {
      if (this.domElement === document) {
        this.viewHalfX = window.innerWidth / 2;
        this.viewHalfY = window.innerHeight / 2;
      } else {
        this.viewHalfX = this.domElement.offsetWidth / 2;
        this.viewHalfY = this.domElement.offsetHeight / 2;
      }
    };

    // FirstPersonControls
    this.onPointerMove = function (event) {
      pointer.set(event.clientX, event.clientY);

      const movementX = pointer.x - pointerOld.x;
      const movementY = pointer.y - pointerOld.y;

      if (this.changeAngle) {
        const camera = this.object;
        _euler.setFromQuaternion(camera.quaternion);

        _euler.y -= movementX * 0.002 * this.pointerSpeed;
        _euler.x -= movementY * 0.002 * this.pointerSpeed;

        _euler.x = Math.max(
          _PI_2 - this.maxPolarAngle,
          Math.min(_PI_2 - this.minPolarAngle, _euler.x)
        );

        camera.quaternion.setFromEuler(_euler);
      } else if (this.dragMap) {
        delta.set(-movementX, movementY, 0);

        const distance = object.position.distanceTo(center);

        delta.multiplyScalar(distance * this.panSpeed);
        delta.applyMatrix3(normalMatrix.getNormalMatrix(object.matrix));

        object.position.add(delta);
        center.add(delta);
      }
      pointerOld.set(event.clientX, event.clientY);
    };

    // FirstPersonControls
    this.onKeyDown = function (event) {
      const { shiftKey, metaKey, ctrlKey, code } = event;
      const ctrlKeyByOs = metaKey || ctrlKey;
      switch (code) {
        case "KeyW":
          this.moveForward = !ctrlKeyByOs ? true : false;
          if (shiftKey) {
            this.movementSpeed = SLOW;
          }
          break;
        case "KeyA":
          this.moveLeft = !ctrlKeyByOs ? true : false;
          if (shiftKey) {
            this.movementSpeed = SLOW;
          }
          break;
        case "KeyS":
          this.moveBackward = !ctrlKeyByOs ? true : false;
          if (shiftKey) {
            this.movementSpeed = SLOW;
          }
          break;
        case "KeyD":
          this.moveRight = !ctrlKeyByOs ? true : false;
          if (shiftKey) {
            this.movementSpeed = SLOW;
          }
          break;
        case "KeyQ":
          this.moveDown = !ctrlKeyByOs ? true : false;
          if (shiftKey) {
            this.movementSpeed = SLOW;
          }
          break;
        case "KeyE":
          this.moveUp = !ctrlKeyByOs ? true : false;
          if (shiftKey) {
            this.movementSpeed = SLOW;
          }
          break;
      }
    };

    // FirstPersonControls
    this.onKeyUp = function (event) {
      const { shiftKey, metaKey, ctrlKey, code } = event;
      const ctrlKeyByOs = metaKey || ctrlKey;
      switch (event.code) {
        case "KeyW":
          this.moveForward = false;
          this.movementSpeed = NORMAL;
          break;
        case "KeyA":
          this.moveLeft = false;
          this.movementSpeed = NORMAL;
          break;
        case "KeyS":
          this.moveBackward = false;
          this.movementSpeed = NORMAL;
          break;
        case "KeyD":
          this.moveRight = false;
          this.movementSpeed = NORMAL;
          break;
        case "KeyQ":
          this.moveDown = false;
          this.movementSpeed = NORMAL;
          break;
        case "KeyE":
          this.moveUp = false;
          this.movementSpeed = NORMAL;
          break;
      }
    };

    // FirstPersonControls
    this.onMouseDown = function (event) {
      if (!this.enabled) return;
      if (this.domElement !== document) {
        this.domElement.focus();
      }
      switch (event.button) {
        case 1:
          this.dragMap = true;
          break;
        case 2:
          this.changeAngle = true;
          break;
      }
      pointerOld.set(event.clientX, event.clientY);
    };

    // FirstPersonControls
    this.onMouseUp = function (event) {
      if (!this.enabled) return;
      this.dragMap = false;
      this.changeAngle = false;
    };

    // OrbitControls
    this.onWheel = function (event) {
      clearTimeout(scrollTimeout);
      if (!this.enabled) return;
      if (event.deltaY > WHEEL_SENSITIVITY) {
        this.movementSpeed = FAST;
        this.moveForward = false;
        this.moveBackward = true;
      } else if (event.deltaY < -1 * WHEEL_SENSITIVITY) {
        this.movementSpeed = FAST;
        this.moveForward = true;
        this.moveBackward = false;
      } else {
        this.movementSpeed = NORMAL;
        this.moveForward = false;
        this.moveBackward = false;
      }

      scrollTimeout = setTimeout(() => {
        this.moveForward = false;
        this.moveBackward = false;
      }, 200);
    };

    this.onWheelDown = function (event) {
      if (!this.enabled) return;
      if (this.domElement !== document) {
        this.domElement.focus();
      }
      this.dragMap = true;
    };

    this.onWheelUp = function (event) {
      if (!this.enabled) return;
      if (this.domElement !== document) {
        this.domElement.focus();
      }
      this.dragMap = false;
    };

    this.lookAt = function (x, y, z) {
      if (x.isVector3) {
        _target.copy(x);
      } else {
        _target.set(x, y, z);
      }
      this.object.lookAt(_target);
      setOrientation(this);
      return this;
    };

    // FirstPersonControls
    this.update = (function () {
      const targetPosition = new Vector3();

      return function update(_delta) {
        if (this.enabled === false) return;
        raycaster.setFromCamera(new Vector2(0, 0), this.object);

        if (this.heightSpeed) {
          const y = MathUtils.clamp(
            this.object.position.y,
            this.heightMin,
            this.heightMax
          );
          const heightDelta = y - this.heightMin;

          this.autoSpeedFactor = _delta * (heightDelta * this.heightCoef);
        } else {
          this.autoSpeedFactor = 0.0;
        }

        const actualMoveSpeed = _delta * this.movementSpeed;

        if (this.moveForward || (this.autoForward && !this.moveBackward))
          this.object.translateZ(-(actualMoveSpeed + this.autoSpeedFactor));
        if (this.moveBackward) this.object.translateZ(actualMoveSpeed);

        if (this.moveLeft) this.object.translateX(-actualMoveSpeed);
        if (this.moveRight) this.object.translateX(actualMoveSpeed);

        if (this.moveUp) this.object.translateY(actualMoveSpeed);
        if (this.moveDown) this.object.translateY(-actualMoveSpeed);

        if (this.changeAngle === false) return;
      };
    })();

    this.dispose = function () {
      this.domElement.removeEventListener("contextmenu", contextmenu);
      this.domElement.removeEventListener("pointermove", _onPointerMove);
      this.domElement.removeEventListener("mousedown", _onMouseDown);
      this.domElement.removeEventListener("mouseup", _onMouseUp);
      this.domElement.removeEventListener("wheel", _onWheel);

      window.removeEventListener("keydown", _onKeyDown);
      window.removeEventListener("keyup", _onKeyUp);
    };

    const _onPointerMove = this.onPointerMove.bind(this);
    const _onKeyDown = this.onKeyDown.bind(this);
    const _onKeyUp = this.onKeyUp.bind(this);
    const _onMouseDown = this.onMouseDown.bind(this);
    const _onMouseUp = this.onMouseUp.bind(this);
    const _onWheel = this.onWheel.bind(this);

    this.domElement.addEventListener("contextmenu", contextmenu);
    this.domElement.addEventListener("pointermove", _onPointerMove);
    this.domElement.addEventListener("mousedown", _onMouseDown);
    this.domElement.addEventListener("mouseup", _onMouseUp);
    this.domElement.addEventListener("wheel", _onWheel);

    window.addEventListener("keydown", _onKeyDown);
    window.addEventListener("keyup", _onKeyUp);

    function setOrientation(controls) {
      const quaternion = controls.object.quaternion;

      _lookDirection.set(0, 0, -1).applyQuaternion(quaternion);
      _spherical.setFromVector3(_lookDirection);

      lat = 90 - MathUtils.radToDeg(_spherical.phi);
      lon = MathUtils.radToDeg(_spherical.theta);
    }

    this.handleResize();

    setOrientation(this);
  }
}

function contextmenu(event) {
  event.preventDefault();
}

export default CustomControls;
