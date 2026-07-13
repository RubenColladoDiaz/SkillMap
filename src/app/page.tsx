"use client";

import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Difficulty, SkillNode, SkillNodeStatus } from "./types/SkillNode";
import UpdaterNode from "./flow/nodes/UpdaterNode";

const nodeStructures: SkillNode[] = [
  {
    id: "n1",
    title: "React Basics",
    description: "Learn the basics",
    status: SkillNodeStatus.PENDING,
    category: "Tech",
    difficulty: Difficulty.NORMAL,
    dependsOn: [],
    x: 0,
    y: 180,
  },
  {
    id: "n2",
    title: "Hooks",
    description: "Learn the React Hooks",
    status: SkillNodeStatus.IN_PROGRESS,
    category: "Tech",
    difficulty: Difficulty.NORMAL,
    dependsOn: ["n1"],
    x: 50,
    y: 280,
  },
  {
    id: "n3",
    title: "Events",
    description: "Learn the React Events",
    status: SkillNodeStatus.FINISHED,
    category: "Tech",
    difficulty: Difficulty.NORMAL,
    dependsOn: ["n2"],
    x: 100,
    y: 380,
  },
];

const initialNodes = getNodes(nodeStructures);

const initialEdges = getEdges(nodeStructures);

const nodeTypes = {
  updaterNode: UpdaterNode,
};

function getNodes(nodes: SkillNode[]) {
  return nodes.map((node) => ({
    id: node.id,
    type: "updaterNode",
    position: { x: node.x, y: node.y },
    data: {
      status: node.status,
      title: node.title,
      category: node.category,
      difficulty: node.difficulty,
    },
  }));
}
function getEdges(nodes: SkillNode[]) {
  return nodes.flatMap((node) =>
    node.dependsOn.map((dependencyId) => ({
      id: `${dependencyId}-${node.id}`,
      source: dependencyId,
      target: node.id,
    })),
  );
}

export default function Home() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
}
