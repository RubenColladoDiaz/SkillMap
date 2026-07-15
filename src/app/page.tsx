"use client";

import { ReactFlowProvider } from "@xyflow/react";
import Canvas from "./pages/Canvas";

export default function Home() {
  return (
    <ReactFlowProvider>
      <Canvas />
    </ReactFlowProvider>
  );
}
