type Props = {
  x: number;
  y: number;
  nodeIdToDelete: string | null;
  deleteNode: () => void;
  createNode: () => void;
};

export default function ContextualMenu(props: Props) {
  return (
    <div
      style={{
        position: "fixed",
        left: props.x,
        top: props.y,
      }}
      className="z-50 rounded-lg border border-slate-700 bg-slate-900 p-1 shadow-xl"
    >
      <button
        onClick={
          props.nodeIdToDelete !== null ? props.deleteNode : props.createNode
        }
        className="rounded-md px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
      >
        {props.nodeIdToDelete !== null ? "Eliminar" : "Crear nodo"}
      </button>
    </div>
  );
}
