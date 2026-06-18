import { useDroppable } from "@dnd-kit/react";

function Droppable({ id, children, name }) {
  const { ref } = useDroppable({
    id,
  });

  return (
    <div ref={ref} className={name}>
      {children}
    </div>
  );
}

export default Droppable;
