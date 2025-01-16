"use client";

import { useRef } from "react";
import { useEditor } from "@/context/editorContext";
import ImportImg from "@/public/assets/import.svg";
import EditorNavbar from "../EditorNavbar";
import Canvas from "../canvas/Canvas";

const CanvasContainer = () => {
  const { importModel } = useEditor();

  const importRef = useRef();

  const renderBottomLeftHoverItems = () => {
    return (
      <div className="absolute bottom-7 left-7 flex w-[152px] flex-col items-start justify-between rounded-[9px] px-[5px] py-[4px] bg-[#eeeeee]/80">
        <button
          className="flex w-full flex-row items-center justify-start rounded-[6px] px-[14px] py-[7px] hover:bg-white hover:opacity-100"
          onClick={() => {
            importRef.current.click();
          }}
        >
          <ImportImg width={20} />
          <div className="ml-[12px] text-[12px] font-light leading-[19.7px]">
            <input
              ref={importRef}
              type="file"
              style={{ display: "none" }}
              accept=".fbx, .gltf"
              onChange={importModel}
            />
            Import
          </div>
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col bg-[#eeeeee]">
      <EditorNavbar />
      {renderBottomLeftHoverItems()}
      <Canvas />
    </div>
  );
};

export default CanvasContainer;
