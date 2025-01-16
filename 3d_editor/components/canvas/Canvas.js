import React, { useEffect, useRef } from "react";
import { useEditor } from "../../context/editorContext";
import { useLoading } from "../../context/loadingContext";

const Canvas = () => {
  const ref = useRef();
  const {
    isEditorLoaded,
    scene,
    camera,
    cameraControls,
    cameraViewHelper,
    renderer,
    composer,
    clock,
    setEditorWidth,
    setEditorHeight,
    getOnlyMeshsFromScene,
    raycaster,
    pointer,
    targetMesh,
    handleSelectedMesh,
    disposeSelectedMeshs,
  } = useEditor();
  const { setIsLoading } = useLoading();
  const animateRef = useRef();

  useEffect(() => {
    if (!isEditorLoaded || !ref || !ref?.current) {
      return;
    }
    onWindowResize(false);
    cancelAnimationFrame(animateRef.current);
    requestAnimationFrame(animate);

    ref?.current.addEventListener("mousemove", onPointerMove);
    ref?.current.addEventListener("click", onPointerClick);
    ref?.current.addEventListener("pointerup", onPointerUp);
    ref?.current.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", onWindowResize);

    return () => {
      ref?.current?.removeEventListener("mousemove", onPointerMove);
      ref?.current?.removeEventListener("click", onPointerClick);
      ref?.current?.removeEventListener("pointerup", onPointerUp);
      ref?.current?.removeEventListener("pointerdown", onPointerDown);
      window?.removeEventListener("resize", onWindowResize);
    };
  }, [ref, isEditorLoaded, scene, composer, cameraViewHelper]);

  const animate = () => {
    const delta = clock.getDelta();
    cameraControls.update(delta);
    cameraViewHelper.update(delta);

    // renderer.render(scene, camera);
    // cameraViewHelper.render(renderer);

    composer.render();
    cameraViewHelper.render(composer.renderer);
    animateRef.current = requestAnimationFrame(animate);
  };

  const onWindowResize = (removeChild = true) => {
    if (removeChild) {
      ref?.current.removeChild(renderer.domElement);
    }
    if (!ref || !ref.current) return;
    const { clientWidth, clientHeight } = ref.current;

    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(clientWidth, clientHeight);
    composer.setSize(clientWidth, clientHeight);
    ref?.current.appendChild(renderer.domElement);
  };

  const onPointerMove = (event) => {
    pointer.x = (event.clientX / ref?.current?.clientWidth) * 2 - 1;
    // except editorNavBar Height (78)
    pointer.y = -((event.clientY - 78) / ref?.current?.clientHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(
      getOnlyMeshsFromScene(),
      true
    );

    const hit = intersects[0];
    document.body.style.cursor = hit ? "pointer" : "default";
  };

  const onPointerClick = (event) => {
    const intersects = raycaster.intersectObjects(
      getOnlyMeshsFromScene(),
      true
    );
    console.log("intersects", intersects);
    if (!intersects.length) {
      disposeSelectedMeshs();
      return;
    }
    const selectMulti = event.metaKey || event.ctrlKey;
    const selectedMesh = intersects[0]?.object;
    const { uuid } = selectedMesh;
    handleSelectedMesh(uuid, selectMulti ? "multi" : "single");
  };

  const onPointerDown = (event) => {
    event.stopPropagation();
  };

  const onPointerUp = (event) => {
    event.stopPropagation();
    cameraViewHelper.handleClick(event);
  };

  return <div ref={ref} className="flex flex-1" />;
};

export default Canvas;
