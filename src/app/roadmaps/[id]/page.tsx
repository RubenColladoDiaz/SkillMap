"use client";

import { ReactFlowProvider } from "@xyflow/react";
import Canvas from "../../pages/Canvas";
import { useParams } from "next/navigation";

export default function RoadmapPage() {
  const params = useParams<{ id: string }>();
  console.log(params);
  return (
    <ReactFlowProvider>
      <Canvas roadmapId={params.id} />
    </ReactFlowProvider>
  );
}
