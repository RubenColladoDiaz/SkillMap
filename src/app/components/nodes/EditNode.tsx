import { Difficulty, SkillNodeStatus } from "@/app/types/SkillNode";
import { FormEvent, useEffect, useRef } from "react";

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
    data: {
      title: string;
      description: string;
      category: string;
      status: SkillNodeStatus;
      difficulty: Difficulty;
    },
  ) => void;
}) {
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const catRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLSelectElement>(null);
  const diffRef = useRef<HTMLSelectElement>(null);

  function onSubmit(event: FormEvent) {
    if (!node) return;
    event.preventDefault();

    const formValues = {
      title: titleRef.current?.value ?? "",
      description: descRef.current?.value ?? "",
      category: catRef.current?.value ?? "",
      status:
        (statusRef.current?.value as SkillNodeStatus) ??
        SkillNodeStatus.PENDING,
      difficulty: (diffRef.current?.value as Difficulty) ?? Difficulty.NORMAL,
    };
    onSaveEditPanel(node?.id, formValues);
    onCloseEditPanel();
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

            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
                Categoría
              </label>
              <input
                type="text"
                ref={catRef}
                defaultValue={node?.data.category}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
                  Estado
                </label>
                <select
                  defaultValue={node?.data.status}
                  ref={statusRef}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                >
                  {Object.values(SkillNodeStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
                  Dificultad
                </label>
                <select
                  defaultValue={node?.data.difficulty}
                  ref={diffRef}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                >
                  {Object.values(Difficulty).map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="mt-6 border-t border-slate-800 pt-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              ID del nodo
            </p>
            <p className="text-sm text-slate-400">{node?.id}</p>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCloseEditPanel}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-400"
            >
              Guardar
            </button>
          </div>{" "}
        </form>
      </div>
    </div>
  );
}
