import { useRouter } from "next/navigation";
import { Roadmap } from "../../../types/Roadmap";

type Props = {
  roadmap: Roadmap;
  openMenuRoadmapId: string | null;
  toggleRoadmapMenu: (event, roadmap: Roadmap) => void;
  editRoadmap: (event, roadmap: Roadmap) => void;
  deleteRoadmap: (event, roadmap: Roadmap) => void;
};

export default function RoadmapCard(props: Props) {
  const router = useRouter();

  return (
    <div
      key={props.roadmap.id}
      onClick={() => router.push(`/roadmaps/${props.roadmap.id}`)}
      className="relative cursor-pointer rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-lg transition hover:border-emerald-400 hover:shadow-emerald-500/10"
    >
      <button
        onClick={(event) => props.toggleRoadmapMenu(event, props.roadmap)}
        className="absolute top-3 right-3 rounded-full p-1 text-slate-500 hover:bg-slate-800 hover:text-white"
      >
        ⋮
      </button>
      {props.openMenuRoadmapId === props.roadmap.id && (
        <div className="absolute top-10 right-3 z-10 w-32 rounded-lg border border-slate-700 bg-slate-800 p-1 shadow-xl">
          <button
            onClick={(event) => props.editRoadmap(event, props.roadmap)}
            className="w-full rounded-md px-3 py-1.5 text-left text-sm text-slate-200 hover:bg-slate-700"
          >
            Editar
          </button>
          <button
            onClick={(event) => props.deleteRoadmap(event, props.roadmap)}
            className="w-full rounded-md px-3 py-1.5 text-left text-sm text-red-400 hover:bg-slate-700"
          >
            Eliminar
          </button>
        </div>
      )}
      <p className="pr-6 font-semibold text-white">{props.roadmap.name}</p>
      <p className="mt-1 text-xs text-slate-400 line-clamp-2">
        {props.roadmap.description}
      </p>
      <p className="mt-2 text-xs text-slate-500">
        {props.roadmap.SkillNode[0]?.count ?? 0} nodos
      </p>
    </div>
  );
}
