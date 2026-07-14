"use client";

import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Difficulty, SkillNode, SkillNodeStatus } from "./types/SkillNode";
import UpdaterNode from "./flow/nodes/UpdaterNode";
import EditNode from "./components/nodes/EditNode";

const nodeStructures: SkillNode[] = [
  {
    id: "n1",
    title: "React Basics",
    description: "Learn the basics",
    status: SkillNodeStatus.PENDING,
    category: "Tech",
    difficulty: Difficulty.EASY,
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
    difficulty: Difficulty.HARD,
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
      description: node.description,
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
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

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
  const onNodeClick: NodeMouseHandler = (event, node) => {
    setSelectedNodeId(node.id);
  };

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  const onCloseEditPanel = () => setSelectedNodeId(null);

  const onSaveEditPanel = (
    id: string,
    data: { title: string; description: string },
  ) => {};

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {selectedNodeId !== null && (
        <EditNode
          node={selectedNode}
          onCloseEditPanel={onCloseEditPanel}
          onSaveEditPanel={onSaveEditPanel}
        ></EditNode>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
}
