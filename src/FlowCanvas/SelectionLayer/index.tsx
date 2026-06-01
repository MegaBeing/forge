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
        fill="#7d3bf633"
        stroke="#7d3bf6"
        strokeWidth={1.5}
      />
    </Layer>
  );
});
