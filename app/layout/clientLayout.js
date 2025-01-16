"use client";

import React from "react";
import { LoadingProvider } from "@/context/loadingContext";

const ClientLayout = ({ children }) => {
  return <LoadingProvider>{children}</LoadingProvider>;
};

export default ClientLayout;
