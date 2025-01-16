"use client";

import React, { useState, useEffect } from "react";
import { useRef } from "react";
import LeftArrow from "@/public/assets/left_arrow.svg";
import SelectIcon from "@/public/assets/select_icon.svg";
import MoveIcon from "@/public/assets/move_icon.svg";
import RotateIcon from "@/public/assets/rotate_icon.svg";
import ScaleIcon from "@/public/assets/scale_icon.svg";
import TotalActionIcon from "@/public/assets/total_action_icon.svg";
import SelectSelectedIcon from "@/public/assets/select_selected_icon.svg";
import MoveSelectedIcon from "@/public/assets/move_selected_icon.svg";
import RotateSelectedIcon from "@/public/assets/rotate_selected_icon.svg";
import ScaleSelectedIcon from "@/public/assets/scale_selected_icon.svg";
import TotalActionSelectedIcon from "@/public/assets/total_action_selected_icon.svg";
import ThreeDModelIcon from "@/public/assets/3d_model_icon.svg";
import TwoDModelIcon from "@/public/assets/2d_model_icon.svg";
import TwoDModelIconLg from "@/public/assets/2d_model_icon_lg.svg";
import TextIcon from "@/public/assets/text_icon.svg";

import Circle2DModelIcon from "@/public/assets/circle_2d.svg";

import ThreeDModel1 from "@/public/assets/model_1.svg";
import ThreeDModel2 from "@/public/assets/model_2.svg";
import ThreeDModel3 from "@/public/assets/model_3.svg";
import ThreeDModel4 from "@/public/assets/model_4.svg";
import ThreeDModel5 from "@/public/assets/model_5.svg";
import ThreeDModel6 from "@/public/assets/model_6.svg";
import { useEditor } from "@/context/editorContext";
import Link from "next/link";
import { EDITOR_STATE, MESH_TYPE } from "@/components/utils/constants";
import useClickOutside from "@/hooks/useClickOutside";

const EditorNavbar = () => {
  const { editorState, setEditorState, addMesh, exportModel } = useEditor();
  const [is3DmenuVisible, set3DmenuOpen] = useState(false);
  const [is2DmenuVisible, set2DmenuOpen] = useState(false);
  const twoDMenuRef = useRef(null);
  const threeDMenuRef = useRef(null);

  useClickOutside(threeDMenuRef, () => {
    set3DmenuOpen(false);
  });

  useClickOutside(twoDMenuRef, () => {
    set2DmenuOpen(false);
  });

  const onActionClick = (action) => {
    setEditorState(action);
  };

  const toggle3Dmenu = () => {
    set3DmenuOpen(!is3DmenuVisible);
  };

  const toggle2Dmenu = () => {
    set2DmenuOpen(!is2DmenuVisible);
  };

  const THREE_D_MENU = [
    {
      key: MESH_TYPE.BOX3,
      icon: <ThreeDModel3 />,
      onClick: () => {
        addMesh(MESH_TYPE.BOX3);
        set3DmenuOpen(false);
      },
    },
    {
      key: MESH_TYPE.CYLINDER,
      icon: <ThreeDModel2 />,
      onClick: () => {
        addMesh(MESH_TYPE.CYLINDER);
        set3DmenuOpen(false);
      },
    },
    {
      key: MESH_TYPE.CONE,
      icon: <ThreeDModel1 />,
      onClick: () => {
        addMesh(MESH_TYPE.CONE);
        set3DmenuOpen(false);
      },
    },
    {
      key: MESH_TYPE.TORUS,
      icon: <ThreeDModel4 />,
      onClick: () => {
        addMesh(MESH_TYPE.TORUS);
        set3DmenuOpen(false);
      },
    },
    {
      key: MESH_TYPE.CIRCLE3,
      icon: <ThreeDModel5 />,
      onClick: () => {
        addMesh(MESH_TYPE.CIRCLE3);
        set3DmenuOpen(false);
      },
    },
    {
      key: MESH_TYPE.ICOSAHEDRON,
      icon: <ThreeDModel6 />,
      onClick: () => {
        addMesh(MESH_TYPE.ICOSAHEDRON);
        set3DmenuOpen(false);
      },
    },
  ];

  const TWO_D_MENU = [
    {
      key: "square",
      icon: <TwoDModelIconLg />,
      onClick: () => {
        addMesh(MESH_TYPE.BOX2);
        set2DmenuOpen(false);
      },
    },
    {
      key: "circle",
      icon: <Circle2DModelIcon />,
      onClick: () => {
        addMesh(MESH_TYPE.CIRCLE2);
        set2DmenuOpen(false);
      },
    },
  ];

  const renderThreeDMenu = () => {
    return (
      <div className="relative flex" ref={threeDMenuRef}>
        <button
          onClick={toggle3Dmenu}
          className={`relative flex h-12 w-12 items-center justify-center rounded-xl ${
            is3DmenuVisible
              ? "rounded-b-none bg-[#7A7AFF]"
              : "all bg-[#afafff] transition duration-300 ease-in-out hover:bg-[#7A7AFF]"
          }`}
        >
          <ThreeDModelIcon />
          <img
            src="../images/drop2.png"
            className={`absolute bottom-[7px] right-[7px]  transition-opacity duration-500 ${
              is3DmenuVisible ? "opacity-0" : "opacity-100"
            }`}
          />
        </button>
        {is3DmenuVisible && (
          <div className="dropdown-shadow absolute top-[48px] w-[296px] rounded-xl rounded-tl-none bg-[#7A7AFF]">
            <div className="fill-curved bg-[#7A7AFF] before:bg-[#7A7AFF]" />
            <div className="relative grid grid-cols-4 gap-2 p-3">
              {THREE_D_MENU.map((menu) => (
                <button
                  key={menu.key}
                  onClick={() => {
                    menu.onClick();
                  }}
                  className="flex h-[62px] w-[62px] items-center justify-center rounded-lg bg-[#afafff]"
                >
                  {menu.icon}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTwoDMenu = () => {
    return (
      <div className="relative flex" ref={twoDMenuRef}>
        <button
          onClick={toggle2Dmenu}
          className={`relative flex h-12 w-12 items-center justify-center rounded-xl ${
            is2DmenuVisible
              ? "rounded-b-none bg-[#F4D440]"
              : "all bg-[#FFE779] transition duration-300 ease-in-out hover:bg-[#F4D440]"
          }`}
        >
          <TwoDModelIcon />
          <img
            src="../images/drop2.png"
            className={`absolute bottom-[7px] right-[7px]  transition-opacity duration-500 ${
              is2DmenuVisible ? "opacity-0" : "opacity-100"
            }`}
          />
        </button>
        {is2DmenuVisible && (
          <div className="dropdown-shadow absolute top-[48px] w-[158px] rounded-xl rounded-tl-none bg-[#F4D440]">
            <div className="fill-curved bg-[#F4D440] before:bg-[#F4D440]" />
            <div className="relative grid grid-cols-2 gap-2 p-3">
              {TWO_D_MENU.map((menu) => (
                <button
                  key={menu.key}
                  onClick={() => {
                    menu.onClick();
                  }}
                  className="flex h-[62px] w-[62px] items-center justify-center rounded-lg bg-[#f8e58c]"
                >
                  {menu.icon}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderOptions = () => {
    return (
      <div className="inset-0 flex items-center justify-center">
        <div className=" flex flex-row items-center justify-center gap-4">
          <button
            onClick={() => onActionClick(EDITOR_STATE.SELECTION)}
            style={{
              background:
                editorState === EDITOR_STATE.SELECTION
                  ? "linear-gradient(90deg, #658FFF 0%, #7A7AFF 100%)"
                  : "",
            }}
            className={`align-center flex h-12 w-12 flex-col items-center justify-center rounded-xl
            ${
              editorState === EDITOR_STATE.SELECTION
                ? ""
                : "all bg-white transition duration-300 ease-in-out hover:bg-gray-300"
            }
            `}
          >
            {editorState === EDITOR_STATE.SELECTION ? (
              <SelectSelectedIcon />
            ) : (
              <SelectIcon />
            )}
          </button>
          <button
            onClick={() => onActionClick(EDITOR_STATE.MOVEMENT)}
            style={{
              background:
                editorState === EDITOR_STATE.MOVEMENT
                  ? "linear-gradient(90deg, #658FFF 0%, #7A7AFF 100%)"
                  : "",
            }}
            className={`align-center flex h-12 w-12 flex-col items-center justify-center rounded-xl
            ${
              editorState === EDITOR_STATE.MOVEMENT
                ? ""
                : "all bg-white transition duration-300 ease-in-out hover:bg-gray-300"
            }
            `}
          >
            {editorState === EDITOR_STATE.MOVEMENT ? (
              <MoveSelectedIcon />
            ) : (
              <MoveIcon />
            )}
          </button>
          <button
            onClick={() => onActionClick(EDITOR_STATE.ROTATION)}
            style={{
              background:
                editorState === EDITOR_STATE.ROTATION
                  ? "linear-gradient(90deg, #658FFF 0%, #7A7AFF 100%)"
                  : "",
            }}
            className={`align-center flex h-12 w-12 flex-col items-center justify-center rounded-xl
          ${
            editorState === EDITOR_STATE.ROTATION
              ? ""
              : "all bg-white transition duration-300 ease-in-out hover:bg-gray-300"
          }
          `}
          >
            {editorState === EDITOR_STATE.ROTATION ? (
              <RotateSelectedIcon />
            ) : (
              <RotateIcon />
            )}
          </button>
          <button
            onClick={() => onActionClick(EDITOR_STATE.SCALE)}
            style={{
              background:
                editorState === EDITOR_STATE.SCALE
                  ? "linear-gradient(90deg, #658FFF 0%, #7A7AFF 100%)"
                  : "",
            }}
            className={`align-center flex h-12 w-12 flex-col items-center justify-center rounded-xl
            ${
              editorState === EDITOR_STATE.SCALE
                ? ""
                : "all bg-white transition duration-300 ease-in-out hover:bg-gray-300"
            }
            `}
          >
            {editorState === EDITOR_STATE.SCALE ? (
              <ScaleSelectedIcon />
            ) : (
              <ScaleIcon />
            )}
          </button>
          <button
            onClick={() => onActionClick(EDITOR_STATE.ALL_MOVEMENET)}
            style={{
              background:
                editorState === EDITOR_STATE.ALL_MOVEMENET
                  ? "linear-gradient(90deg, #658FFF 0%, #7A7AFF 100%)"
                  : "",
            }}
            className={`align-center flex h-12 w-12 flex-col items-center justify-center rounded-xl
${
  editorState === EDITOR_STATE.ALL_MOVEMENET
    ? ""
    : "all bg-white transition duration-300 ease-in-out hover:bg-gray-300"
}
`}
          >
            {editorState === EDITOR_STATE.ALL_MOVEMENET ? (
              <TotalActionSelectedIcon />
            ) : (
              <TotalActionIcon />
            )}
          </button>
          <div className="h-5 w-1 rounded bg-[#d9d9d9]" />
          <button
            onClick={() => addMesh(MESH_TYPE.TEXT)}
            className="align-center all flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-[#85FCD8] transition duration-300 ease-in-out hover:bg-[#3AE1AF]"
          >
            <TextIcon />
          </button>
          {renderThreeDMenu()}
          {renderTwoDMenu()}
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full">
      <div className="flex h-[78px] flex-1 items-center px-6">
        <div className="flex flex-row items-center justify-between gap-6"></div>
        <div className="flex flex-1 flex-row items-center justify-start">
          <Link href="/">
            <LeftArrow />
          </Link>
        </div>
        {renderOptions()}
        <div className="flex flex-1 justify-end">
          <button
            className="flex h-12 w-full max-w-[124px] flex-col items-center justify-center rounded-[50px] bg-[#658fff]"
            onClick={exportModel}
          >
            <div className="w-32 text-center text-xs font-medium leading-[21.3px] text-white">
              Save
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorNavbar;
