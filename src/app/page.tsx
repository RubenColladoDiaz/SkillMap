"use client";

import { useEffect, useState } from "react";
import { Roadmap } from "./types/Roadmap";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();

  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);

  useEffect(() => {
    if (localStorage.getItem("roadmaps") !== null) {
      const roadmaps: Roadmap[] = JSON.parse(
        localStorage.getItem("roadmaps") ?? "",
      );
      setRoadmaps(roadmaps);
    }
  }, []);

  function createRoadmap() {
    const uniqueId = crypto.randomUUID();
    const newRoadmap: Roadmap = {
      id: uniqueId,
      name: "Nuevo Roadmap",
      description: "",
      nodes: [],
      edges: [],
    };
    const updatedRoadmaps = [...roadmaps, newRoadmap];
    setRoadmaps(updatedRoadmaps);
    localStorage.setItem("roadmaps", JSON.stringify(updatedRoadmaps));
    router.push("/roadmaps/" + uniqueId);
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Mis Roadmaps</h1>
          <button
            onClick={createRoadmap}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-400"
          >
            Crear Roadmap
          </button>
        </div>

        {roadmaps.length === 0 ? (
          <p className="text-sm text-slate-500">
            Todavía no tienes ningún roadmap. Crea el primero para empezar.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {roadmaps.map((roadmap) => (
              <Link
                key={roadmap.id}
                href={`/roadmaps/${roadmap.id}`}
                className="rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-lg transition hover:border-emerald-400 hover:shadow-emerald-500/10"
              >
                <p className="font-semibold text-white">{roadmap.name}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {roadmap.nodes.length} nodos
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
