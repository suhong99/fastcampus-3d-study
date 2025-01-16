"use client";

import React from "react";
import { EditorProvider } from "../../context/editorContext";
// import { EditorProvider } from "@/context/editorContext";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-1 h-[100vh] w-[100vw]">
      <div className="flex md:hidden flex-1 items-center justify-center ">
        <div>Desktop 환경에서 접속해주세요</div>
      </div>
      <div className="hidden md:flex">
        <EditorProvider>{children}</EditorProvider>
      </div>
    </div>
  );
};

export default Layout;
