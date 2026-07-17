"use client";

import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  NodeMouseHandler,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Difficulty, SkillNode, SkillNodeStatus } from "../types/SkillNode";
import UpdaterNode from "../flow/nodes/UpdaterNode";
import EditNode from "../components/nodes/EditNode";
import ProgressBar from "../components/ProgressBar";
import { Roadmap } from "../types/Roadmap";

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

export default function Canvas({ roadmapId }: { roadmapId: string }) {
  const { screenToFlowPosition } = useReactFlow();

  const [nodes, setNodes] = useState(() => initialNodes);
  const [edges, setEdges] = useState(() => initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [contextualMenuPosition, setContextualMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [flowPosition, setFlowPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [nodeIdToDelete, setNodeIdToDelete] = useState<string | null>(null);

  const [hasLoaded, setHasLoaded] = useState(false);

  function getProgress() {
    if (nodes.length <= 0) return 0;

    const completedCount = nodes.filter(
      (node) => node.data.status === SkillNodeStatus.FINISHED,
    ).length;
    return (completedCount / nodes.length) * 100;
  }

  const progressPercentage = getProgress();

  // Efecto de carga
  useEffect(() => {
    if (localStorage.getItem("roadmaps") !== null) {
      const roadmaps: Roadmap[] = JSON.parse(
        localStorage.getItem("roadmaps") ?? "",
      );
      const actualRoadmap = roadmaps.find(
        (roadmap) => roadmap.id === roadmapId,
      );
      if (actualRoadmap) {
        setNodes(actualRoadmap.nodes);
        setEdges(actualRoadmap.edges);
      }
    }
    setHasLoaded(true);
  }, [roadmapId]);

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
    setContextualMenuPosition(null);
  };
  const onPaneContextMenu = useCallback(
    (event) => {
      event.preventDefault();
      setContextualMenuPosition({ x: event.clientX, y: event.clientY });
      const flowPosition = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      setFlowPosition(flowPosition);
      setNodeIdToDelete(null);
    },
    [screenToFlowPosition],
  );
  const onPaneClick = useCallback(() => {
    setContextualMenuPosition(null);
  }, []);
  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    setContextualMenuPosition({ x: event.clientX, y: event.clientY });
    setNodeIdToDelete(node.id);
  }, []);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  const onCloseEditPanel = () => setSelectedNodeId(null);

  const onSaveEditPanel = (
    id: string,
    data: {
      title: string;
      description: string;
      category: string;
      status: SkillNodeStatus;
      difficulty: Difficulty;
    },
  ) => {
    setNodes(
      nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node,
      ),
    );
  };

  // Efecto de guardado
  useEffect(() => {
    if (!hasLoaded) return;

    if (localStorage.getItem("roadmaps") !== null) {
      const roadmaps: Roadmap[] = JSON.parse(
        localStorage.getItem("roadmaps") ?? "",
      );
      const updatedRoadmaps = roadmaps.map((roadmap) =>
        roadmap.id === roadmapId
          ? { ...roadmap, nodes: nodes, edges: edges }
          : roadmap,
      );
      localStorage.setItem("roadmaps", JSON.stringify(updatedRoadmaps));
    }
  }, [edges, hasLoaded, nodes, roadmapId]);

  function createNode() {
    if (!flowPosition) return;

    const uniqueId = crypto.randomUUID();
    const newNode = {
      id: uniqueId,
      data: {
        title: "Sin titulo",
        description: "",
        category: "",
        status: SkillNodeStatus.PENDING,
        difficulty: Difficulty.NORMAL,
      },
      position: flowPosition,
      type: "updaterNode",
    };
    setNodes((nodes) => [...nodes, newNode]);
    setContextualMenuPosition(null);
    setSelectedNodeId(uniqueId);
  }
  function deleteNode() {
    setNodes((currentNodes) =>
      currentNodes.filter((node) => node.id !== nodeIdToDelete),
    );
    setEdges((currentEdges) =>
      currentEdges.filter(
        (edge) =>
          edge.target !== nodeIdToDelete && edge.source !== nodeIdToDelete,
      ),
    );
    setContextualMenuPosition(null);
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {selectedNodeId !== null && (
        <EditNode
          node={selectedNode}
          onCloseEditPanel={onCloseEditPanel}
          onSaveEditPanel={onSaveEditPanel}
        ></EditNode>
      )}
      {contextualMenuPosition !== null && (
        <div
          style={{
            position: "fixed",
            left: contextualMenuPosition.x,
            top: contextualMenuPosition.y,
          }}
          className="z-50 rounded-lg border border-slate-700 bg-slate-900 p-1 shadow-xl"
        >
          <button
            onClick={nodeIdToDelete !== null ? deleteNode : createNode}
            className="rounded-md px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
          >
            {nodeIdToDelete !== null ? "Eliminar" : "Crear nodo"}
          </button>
        </div>
      )}
      <ProgressBar percentage={progressPercentage}></ProgressBar>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        onNodeContextMenu={onNodeContextMenu}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneContextMenu={onPaneContextMenu}
        onPaneClick={onPaneClick}
        fitView
      />
    </div>
  );
}
