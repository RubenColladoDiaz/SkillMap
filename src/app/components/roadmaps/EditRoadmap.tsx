import { Roadmap } from "@/app/types/Roadmap";

type props = {
  roadmap: Roadmap | undefined;
  onSave: () => void;
  onClose: () => void;
};

export default function EditRoadmap(props: props) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        props.onSave();
      }}
    >
      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
            Nombre
          </label>
          <input
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
  );
}
