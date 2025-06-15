import { Layer, Stage, Rect } from 'react-konva';
import styles from './canvas.module.css';
import { useRef, useState } from 'react';
import Konva from 'konva';
import { handleZoom } from './utils';

export default function Canvas() {
  const stageRef = useRef<Konva.Stage | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    if (e.evt.ctrlKey) {
      handleZoom(e, scale, stage, position, setScale, setPosition)
      return;
    }
    else if(e.evt.shiftKey) {
      // Handle horizontal panning
      const newPosition = {
        x: position.x - e.evt.deltaY / (scale * 1.2),
        y: position.y,
      };
      setPosition(newPosition);
    }
    else {
      // Handle panning
      const newPosition = {
        x: position.x,
        y: position.y - e.evt.deltaY / (scale * 1.2),
      };
      setPosition(newPosition);
    }

  };

  return (
    <div className={styles.container}>
      <div className={styles.canvas}>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
          ref={stageRef}
          onWheel={handleWheel}
        >
          <Layer>
            <Rect
              x={20}
              y={20}
              width={100}
              height={50}
              fill="green"
              stroke="black"
              strokeWidth={4}
              draggable
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}