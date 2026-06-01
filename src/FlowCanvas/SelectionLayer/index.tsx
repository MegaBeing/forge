import { memo } from "react";
import { Layer, Rect } from "react-konva";
import { SelectionBox } from "../Utils/types";

export const SelectionLayer = memo(function SelectionLayer({ selectionBox }: { selectionBox: SelectionBox | null; }) {
  if (!selectionBox) return null;

  return (
    <Layer listening={false}>
      <Rect
        x={selectionBox.x}
        y={selectionBox.y}
        width={selectionBox.width}
        height={selectionBox.height}
        fill="rgba(59, 130, 246, 0.18)"
        stroke="#3b82f6"
        strokeWidth={1.5}
        dash={[8, 4]} />
    </Layer>
  );
});
