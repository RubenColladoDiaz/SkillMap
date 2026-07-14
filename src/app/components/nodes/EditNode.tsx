import { Difficulty, SkillNodeStatus } from "@/app/types/SkillNode";
import { FormEvent, RefObject, useRef } from "react";

type Props = {
  id: string;
  type: string;
  data: Data;
};
type Data = {
  status: SkillNodeStatus;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
};

export default function EditNode({
  node,
  onCloseEditPanel,
  onSaveEditPanel,
}: {
  node: Props | undefined;
  onCloseEditPanel: () => void;
  onSaveEditPanel: (
    id: string,
    data: { title: string; description: string },
  ) => void;
}) {
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  function onSubmit(event: FormEvent) {
    if (!node) return;
    event.preventDefault();

    const formValues = {
      title: titleRef.current?.value ?? "",
      description: descRef.current?.value ?? "",
    };
    onSaveEditPanel(node?.id, formValues);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold text-white">Editar habilidad</h2>
          <button
            onClick={onCloseEditPanel}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-300">
            {node?.data.category}
          </span>
          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-300">
            {node?.data.difficulty}
          </span>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-400">
            {node?.data.status}
          </span>
        </div>
        <form onSubmit={onSubmit}>
          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
                Título
              </label>
              <input
                type="text"
                ref={titleRef}
                defaultValue={node?.data.title}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
                Descripción
              </label>
              <textarea
                ref={descRef}
                defaultValue={node?.data.description}
                rows={3}
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6 border-t border-slate-800 pt-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              ID del nodo
            </p>
            <p className="text-sm text-slate-400">{node?.id}</p>
          </div>
          <button type="submit">Guardar</button>
        </form>
      </div>
    </div>
  );
}
