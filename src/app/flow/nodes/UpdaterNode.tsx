import { Difficulty, SkillNodeStatus } from "@/app/types/SkillNode";
import { Handle, Position } from "@xyflow/react";

type Props = {
  status: SkillNodeStatus;
  title: string;
  category: string;
  difficulty: Difficulty;
};

const statusStyles = {
  PENDING: "border-slate-500 bg-slate-800",
  IN_PROGRESS: "border-amber-400 bg-amber-950/60",
  FINISHED: "border-emerald-400 bg-emerald-950/60",
};

export default function SkillNodeCard({ data }: { data: Props }) {
  return (
    <div
      className={`min-w-[180px] rounded-xl border-2 px-4 py-3 shadow-lg ${statusStyles[data.status]}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-slate-300" />

      <p className="text-sm font-semibold text-white">{data.title}</p>

      <div className="mt-2 flex gap-1">
        <span className="rounded-full bg-slate-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
          {data.category}
        </span>
        <span className="rounded-full bg-slate-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
          {data.difficulty}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-slate-300"
      />
    </div>
  );
}
