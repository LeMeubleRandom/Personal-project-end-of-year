import { useDraggable } from "@dnd-kit/react";

function Draggable({ cardId, children, name }) {
  const { ref } = useDraggable({
    id: `draggable-${cardId}`,
    data: { cardId },
  });

  return (
    <div ref={ref} className={name}>
      {children}
    </div>
  );
}

export default Draggable;
