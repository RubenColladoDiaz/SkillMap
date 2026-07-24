"use client";

import { useCallback, useEffect, useState } from "react";
import { Roadmap } from "./types/Roadmap";
import EditRoadmap from "./components/Dashboard/roadmaps/EditRoadmap";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import { SkillNode, SkillNodeStatus, Difficulty } from "./types/SkillNode";
import RoadmapCard from "./components/Dashboard/roadmaps/RoadmapCard";

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(
    null,
  );
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState<boolean>(false);
  const [openMenuRoadmapId, setOpenMenuRoadmapId] = useState<string | null>(
    null,
  );

  const startNodes: SkillNode[] = [
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

  async function getRoadmaps() {
    const { data, error } = await supabase
      .from("Roadmap")
      .select("*, SkillNode(count)");

    if (error) {
      console.error(error);
      return;
    }

    setRoadmaps(data);
  }

  useEffect(() => {
    getRoadmaps();
  }, []);

  function openCreatingPanel() {
    setIsCreatePanelOpen(true);
  }
  const toggleRoadmapMenu = useCallback(
    (event, roadmap: Roadmap) => {
      event.stopPropagation();
      if (openMenuRoadmapId === roadmap.id) {
        setOpenMenuRoadmapId(null);
      } else {
        setOpenMenuRoadmapId(roadmap.id);
      }
    },
    [openMenuRoadmapId],
  );

  const selectedRoadmap: Roadmap | undefined = roadmaps.find(
    (roadmap) => roadmap.id === selectedRoadmapId,
  );

  async function onSave(data: { name: string; description: string }) {
    if (isCreatePanelOpen) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: insertedRoadmap, error } = await supabase
        .from("Roadmap")
        .insert({
          name: data.name,
          description: data.description,
          user_id: user?.id,
        })
        .select()
        .single();

      if (error || !insertedRoadmap) {
        console.error(error);
        return;
      }

      const { data: insertedNodes, error: nodesError } = await supabase
        .from("SkillNode")
        .insert(
          startNodes.map((node) => ({
            roadmap_id: insertedRoadmap.id,
            position_x: node.x,
            position_y: node.y,
            title: node.title,
            description: node.description,
            category: node.category,
            status: node.status,
            difficulty: node.difficulty,
          })),
        )
        .select();

      if (nodesError || !insertedNodes) {
        console.error(nodesError);
        return;
      }

      const { error: edgesError } = await supabase.from("Edges").insert([
        {
          roadmap_id: insertedRoadmap.id,
          source: insertedNodes[0].id,
          target: insertedNodes[1].id,
        },
        {
          roadmap_id: insertedRoadmap.id,
          source: insertedNodes[1].id,
          target: insertedNodes[2].id,
        },
      ]);

      if (edgesError) {
        console.error(JSON.stringify(edgesError, null, 2));
        return;
      }

      setIsCreatePanelOpen(false);
      router.push("/roadmaps/" + insertedRoadmap.id);
    }
    if (selectedRoadmapId !== null) {
      await supabase
        .from("Roadmap")
        .update({ name: data.name, description: data.description })
        .eq("id", selectedRoadmapId);

      getRoadmaps();
      setSelectedRoadmapId(null);
    }
  }

  function onClose() {
    setSelectedRoadmapId(null);
    setIsCreatePanelOpen(false);
  }

  const editRoadmap = useCallback((event, roadmap: Roadmap) => {
    event.stopPropagation();
    setSelectedRoadmapId(roadmap.id);
    setOpenMenuRoadmapId(null);
  }, []);

  const deleteRoadmap = useCallback(async (event, roadmap: Roadmap) => {
    event.stopPropagation();

    const { error } = await supabase
      .from("Roadmap")
      .delete()
      .eq("id", roadmap.id);

    if (error) {
      console.error(error);
      return;
    }

    setOpenMenuRoadmapId(null);
    getRoadmaps();
  }, []);

  async function onSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div
      onClick={() => setOpenMenuRoadmapId(null)}
      className="min-h-screen bg-slate-950 p-8"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Mis Roadmaps</h1>
          <div className="flex gap-3">
            <button
              onClick={openCreatingPanel}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-400"
            >
              Crear Roadmap
            </button>
            <button
              onClick={onSignOut}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {(selectedRoadmapId !== null || isCreatePanelOpen === true) && (
          <EditRoadmap
            roadmap={selectedRoadmap}
            onSave={onSave}
            onClose={onClose}
          ></EditRoadmap>
        )}

        {roadmaps.length === 0 ? (
          <p className="text-sm text-slate-500">
            Todavía no tienes ningún roadmap. Crea el primero para empezar.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {roadmaps.map((roadmap) => (
              <RoadmapCard
                key={roadmap.id}
                roadmap={roadmap}
                openMenuRoadmapId={openMenuRoadmapId}
                toggleRoadmapMenu={toggleRoadmapMenu}
                editRoadmap={editRoadmap}
                deleteRoadmap={deleteRoadmap}
              ></RoadmapCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
