import { useDroppable } from "@dnd-kit/react";

function Droppable({ id, children, name }) {
  const { ref, isOver } = useDroppable({
    id,
  });

  return (
    <div ref={ref} className={`${name || ""} ${isOver ? "drag-over" : ""}`}>
      {children}
    </div>
  );
}

export default Droppable;
