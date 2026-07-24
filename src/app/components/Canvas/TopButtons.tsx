import Link from "next/link";

type Props = {
  exportAsJson: () => void;
  exportAsImage: () => void;
};

export default function TopButtons(props: Props) {
  return (
    <div>
      <Link
        href="/"
        className="fixed top-4 left-4 z-40 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm font-medium text-slate-300 shadow-lg backdrop-blur hover:bg-slate-800 hover:text-white"
      >
        ← Volver
      </Link>
      <div className="fixed top-4 right-4 z-40 flex gap-2">
        <button
          onClick={props.exportAsJson}
          className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm font-medium text-slate-300 shadow-lg backdrop-blur hover:bg-slate-800 hover:text-white"
        >
          Exportar JSON
        </button>
        <button
          onClick={props.exportAsImage}
          className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm font-medium text-slate-300 shadow-lg backdrop-blur hover:bg-slate-800 hover:text-white"
        >
          Exportar imagen
        </button>
      </div>
    </div>
  );
}
