"use client";

import { useCallback, useEffect, useState } from "react";
import { Roadmap } from "./types/Roadmap";
import EditRoadmap from "./components/roadmaps/EditRoadmap";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(
    null,
  );
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState<boolean>(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [openMenuRoadmapId, setOpenMenuRoadmapId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (localStorage.getItem("roadmaps") !== null) {
      const roadmaps: Roadmap[] = JSON.parse(
        localStorage.getItem("roadmaps") ?? "",
      );
      setRoadmaps(roadmaps);
    }
    setHasLoaded(true);
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

  useEffect(() => {
    if (!hasLoaded) return;
    localStorage.setItem("roadmaps", JSON.stringify(roadmaps));
  }, [roadmaps, hasLoaded]);

  function onSave(data: { name: string; description: string }) {
    if (isCreatePanelOpen) {
      const uniqueId = crypto.randomUUID();
      const newRoadmap: Roadmap = {
        id: uniqueId,
        name: data.name,
        description: data.description,
        nodes: [],
        edges: [],
      };
      setRoadmaps((currentRoadmaps) => [...currentRoadmaps, newRoadmap]);
      setIsCreatePanelOpen(false);
      router.push("/roadmaps/" + newRoadmap.id);
    }
    if (selectedRoadmapId !== null) {
      setRoadmaps((currentRoadmaps) =>
        currentRoadmaps.map((roadmap) =>
          roadmap.id === selectedRoadmapId
            ? { ...roadmap, name: data.name, description: data.description }
            : roadmap,
        ),
      );
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

  const deleteRoadmap = useCallback((event, roadmap: Roadmap) => {
    event.stopPropagation();
    setRoadmaps((currentRoadmaps) =>
      currentRoadmaps.filter(
        (currentRoadmap) => currentRoadmap.id !== roadmap.id,
      ),
    );
    setOpenMenuRoadmapId(null);
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
              <div
                key={roadmap.id}
                onClick={() => router.push(`/roadmaps/${roadmap.id}`)}
                className="relative cursor-pointer rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-lg transition hover:border-emerald-400 hover:shadow-emerald-500/10"
              >
                <button
                  onClick={(event) => toggleRoadmapMenu(event, roadmap)}
                  className="absolute top-3 right-3 rounded-full p-1 text-slate-500 hover:bg-slate-800 hover:text-white"
                >
                  ⋮
                </button>
                {openMenuRoadmapId === roadmap.id && (
                  <div className="absolute top-10 right-3 z-10 w-32 rounded-lg border border-slate-700 bg-slate-800 p-1 shadow-xl">
                    <button
                      onClick={(event) => editRoadmap(event, roadmap)}
                      className="w-full rounded-md px-3 py-1.5 text-left text-sm text-slate-200 hover:bg-slate-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={(event) => deleteRoadmap(event, roadmap)}
                      className="w-full rounded-md px-3 py-1.5 text-left text-sm text-red-400 hover:bg-slate-700"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
                <p className="pr-6 font-semibold text-white">{roadmap.name}</p>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                  {roadmap.description}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {roadmap.nodes.length} nodos
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
