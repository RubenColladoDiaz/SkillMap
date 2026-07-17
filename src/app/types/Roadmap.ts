import type { Node, Edge } from "@xyflow/react";

export type Roadmap = {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
};
