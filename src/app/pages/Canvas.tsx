"use client";

import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  NodeMouseHandler,
  useReactFlow,
  Node,
  Edge,
  getViewportForBounds,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Difficulty, SkillNodeStatus } from "../types/SkillNode";
import UpdaterNode from "../flow/nodes/UpdaterNode";
import EditNode from "../components/Canvas/nodes/EditNode";
import ProgressBar from "../components/Canvas/ProgressBar";
import { createClient } from "../../../utils/supabase/client";
import { toPng } from "html-to-image";
import ContextualMenu from "../components/Canvas/ContextualMenu";
import TopButtons from "../components/Canvas/TopButtons";

const nodeTypes = {
  updaterNode: UpdaterNode,
};

export default function Canvas({ roadmapId }: { roadmapId: string }) {
  const { screenToFlowPosition, getNodesBounds } = useReactFlow();
  const supabase = createClient();

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
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

  async function getNodesFromRoadmap(roadmapId: string) {
    const { data: nodeRows, error } = await supabase
      .from("SkillNode")
      .select("*")
      .eq("roadmap_id", roadmapId);

    if (error) {
      console.error(error);
      return [];
    }

    setNodes(
      nodeRows.map((node) => ({
        id: node.id,
        type: "updaterNode",
        position: { x: node.position_x, y: node.position_y },
        data: {
          title: node.title,
          description: node.description,
          category: node.category,
          status: node.status,
          difficulty: node.difficulty,
        },
      })),
    );
  }
  async function getEdgesFromRoadmap(roadmapId: string) {
    const { data: edgeRows, error } = await supabase
      .from("Edges")
      .select("*")
      .eq("roadmap_id", roadmapId);

    if (error) {
      console.error(error);
      return [];
    }

    setEdges(edgeRows);
  }

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
    getNodesFromRoadmap(roadmapId);
    getEdgesFromRoadmap(roadmapId);
  }, []);

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onNodeDragStop = useCallback(
    async (event, node: Node) => {
      const { error: errorMoving } = await supabase
        .from("SkillNode")
        .update({
          position_x: node.position.x,
          position_y: node.position.y,
        })
        .eq("id", node.id);

      if (errorMoving) {
        console.error(JSON.stringify(errorMoving, null, 2));
        return;
      }
    },
    [supabase],
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    async (params) => {
      const { data: connecting, error: errorConnecting } = await supabase
        .from("Edges")
        .insert({
          roadmap_id: roadmapId,
          source: params.source,
          target: params.target,
        })
        .select()
        .single();

      if (errorConnecting) {
        console.error(JSON.stringify(errorConnecting, null, 2));
        return;
      }

      setEdges((edgesSnapshot) => addEdge(connecting, edgesSnapshot));
    },
    [supabase, roadmapId],
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

  const onSaveEditPanel = async (
    id: string,
    data: {
      title: string;
      description: string;
      category: string;
      status: SkillNodeStatus;
      difficulty: Difficulty;
    },
  ) => {
    const { error: editedNodeError } = await supabase
      .from("SkillNode")
      .update({
        title: data.title,
        description: data.description,
        category: data.category,
        status: data.status,
        difficulty: data.difficulty,
      })
      .eq("id", id);

    if (editedNodeError) {
      console.error(JSON.stringify(editedNodeError, null, 2));
      return;
    }

    setNodes(
      nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node,
      ),
    );
  };

  async function createNode() {
    if (!flowPosition) return;

    const { data: newNode, error: newNodeError } = await supabase
      .from("SkillNode")
      .insert({
        roadmap_id: roadmapId,
        position_x: flowPosition.x,
        position_y: flowPosition.y,
        title: "Sin titulo",
        description: "",
        category: "",
        status: SkillNodeStatus.PENDING,
        difficulty: Difficulty.NORMAL,
      })
      .select()
      .single();

    if (newNodeError || !newNode) {
      console.log(JSON.stringify(newNodeError, null, 2));
      return;
    }

    const convertedNode = {
      id: newNode.id,
      type: "updaterNode",
      position: { x: newNode.position_x, y: newNode.position_y },
      data: {
        title: newNode.title,
        description: newNode.description,
        category: newNode.category,
        status: newNode.status,
        difficulty: newNode.difficulty,
      },
    };

    setNodes((nodes) => [...nodes, convertedNode]);
    setContextualMenuPosition(null);
    setSelectedNodeId(convertedNode.id);
  }

  async function deleteNode() {
    const { error: errorDeleting } = await supabase
      .from("SkillNode")
      .delete()
      .eq("id", nodeIdToDelete);

    if (errorDeleting) {
      console.log(JSON.stringify(errorDeleting, null, 2));
      return;
    }

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

  function exportAsJson() {
    const combinedData = { nodes, edges };
    const combinedText = JSON.stringify(combinedData);

    const blob = new Blob([combinedText], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "roadmap.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function exportAsImage() {
    const nodesRectangle = getNodesBounds(nodes);
    const viewport = getViewportForBounds(
      nodesRectangle,
      1024,
      768,
      0.5,
      2,
      0.2,
    );

    const dataUrl = await toPng(
      document.querySelector(".react-flow__viewport") as HTMLElement,
      {
        width: 1024,
        height: 768,
        style: {
          width: "1024px",
          height: "768px",
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
      },
    );
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "roadmap.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <TopButtons
        exportAsJson={exportAsJson}
        exportAsImage={exportAsImage}
      ></TopButtons>
      {selectedNodeId !== null && (
        <EditNode
          node={selectedNode}
          onCloseEditPanel={onCloseEditPanel}
          onSaveEditPanel={onSaveEditPanel}
        ></EditNode>
      )}
      {contextualMenuPosition !== null && (
        <ContextualMenu
          x={contextualMenuPosition.x}
          y={contextualMenuPosition.y}
          nodeIdToDelete={nodeIdToDelete}
          deleteNode={deleteNode}
          createNode={createNode}
        ></ContextualMenu>
      )}
      <ProgressBar percentage={progressPercentage}></ProgressBar>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={onNodeClick}
        onNodeContextMenu={onNodeContextMenu}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneContextMenu={onPaneContextMenu}
        onPaneClick={onPaneClick}
        deleteKeyCode={null}
        fitView
      />
    </div>
  );
}
