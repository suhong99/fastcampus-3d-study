"use client";

import React, { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setIsLoading,
      }}
    >
      {isLoading && (
        <div
          className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center text-xl bg-black/20"
          onClick={() => {
            setIsLoading(false);
          }}
        >
          <div className="flex h-16 w-16 gap-1 justify-center items-center">
            <div className="h-6 w-2 animate-bounce rounded-full bg-[#627fff]" />
            <div
              className="h-6 w-2 animate-bounce rounded-full bg-[#627fff]"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="h-6 w-2 animate-bounce rounded-full bg-[#627fff]"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        </div>
      )}
      <div className="h-[100vh] flex flex-1">{children}</div>
    </LoadingContext.Provider>
  );
};
