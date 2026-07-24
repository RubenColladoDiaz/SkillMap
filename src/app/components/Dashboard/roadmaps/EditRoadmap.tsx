import { Roadmap } from "@/app/types/Roadmap";
import { FormEvent, useRef } from "react";

type props = {
  roadmap: Roadmap | undefined;
  onSave: (data: { name: string; description: string }) => void;
  onClose: () => void;
};

export default function EditRoadmap(props: props) {
  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  function onSubmit(event: FormEvent) {
    event.preventDefault();

    const formValues = {
      name: nameRef.current?.value ?? "",
      description: descRef.current?.value ?? "",
    };

    props.onSave(formValues);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold text-white">
            {props.roadmap ? "Editar Roadmap" : "Nuevo Roadmap"}
          </h2>
          <button
            onClick={props.onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
                Nombre
              </label>
              <input
                ref={nameRef}
                type="text"
                defaultValue={props.roadmap?.name}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
                Descripción
              </label>
              <textarea
                ref={descRef}
                defaultValue={props.roadmap?.description}
                rows={3}
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={props.onClose}
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
          </div>
        </form>
      </div>
    </div>
  );
}
