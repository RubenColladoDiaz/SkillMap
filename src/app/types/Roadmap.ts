import type { Node, Edge } from "@xyflow/react";

export type Roadmap = {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  SkillNode: { count: number }[]; // Para mostrar el contador de nodos creados en el roadmap
};
