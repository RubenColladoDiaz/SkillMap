export default function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <div className="fixed top-4 left-1/2 z-40 w-full max-w-md -translate-x-1/2 rounded-full border border-slate-700 bg-slate-900/80 p-1 shadow-lg backdrop-blur">
      <div className="flex items-center gap-3 px-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs font-medium text-slate-300">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}
