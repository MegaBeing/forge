import { memo, useMemo } from "react";
import { Layer, Circle } from "react-konva";
import { GridDot } from "./Utils/types";
import { GRID_OFFSET, GRID_SPACING } from "@/Toolbar/Utils/constants";

interface IProps {
  stageSize: { width: number; height: number; };
  stageScale: number;
  stagePosition: { x: number; y: number; }; 
}

export const GridLayer = memo(function GridLayer({
  stageSize,
  stageScale,
  stagePosition,
}: IProps) {

  const dots = getGridDots(stageSize, stageScale, stagePosition);
  return (
    <Layer>
      {dots.map((dot) => (
        <Circle
          key={dot.key}
          x={dot.x}
          y={dot.y}
          radius={1}
          fill="rgba(175, 172, 172, 0.919)"
          listening={false} />
      ))}
    </Layer>
  );
});

function getGridDots(stageSize: { width: number; height: number; }, stageScale: number, stagePosition: { x: number; y: number; }) {
  return useMemo(() => {
    if (!stageSize.width || !stageSize.height) return [];

    const visibleWidth = stageSize.width / stageScale;
    const visibleHeight = stageSize.height / stageScale;
    const worldLeft = -stagePosition.x / stageScale;
    const worldTop = -stagePosition.y / stageScale;
    const worldRight = worldLeft + visibleWidth;
    const worldBottom = worldTop + visibleHeight;

    const startColumn = Math.floor((worldLeft - GRID_OFFSET) / GRID_SPACING) - 1;
    const endColumn = Math.ceil((worldRight - GRID_OFFSET) / GRID_SPACING) + 1;
    const startRow = Math.floor((worldTop - GRID_OFFSET) / GRID_SPACING) - 1;
    const endRow = Math.ceil((worldBottom - GRID_OFFSET) / GRID_SPACING) + 1;

    const dots: GridDot[] = [];
    for (let row = startRow; row <= endRow; row += 1) {
      for (let column = startColumn; column <= endColumn; column += 1) {
        dots.push({
          key: `dot-${row}-${column}`,
          x: column * GRID_SPACING + GRID_OFFSET,
          y: row * GRID_SPACING + GRID_OFFSET,
        });
      }
    }

    return dots;
  }, [stagePosition.x, stagePosition.y, stageScale, stageSize.height, stageSize.width]);
}

