"use client";

import { Stage, Layer} from "react-konva";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { useEffect, useRef } from "react";
import Konva from "konva";
import { addComponent } from "@/lib/components";
import { CanvasComponent } from "@/common/component";

export default function CanvasStage() {
  const stageRef = useRef<Konva.Stage | null>(null);
  const componentList = useAppSelector((state: RootState) => state.components);
  console.log({
    componentList
  })
  function getRelativePointerPosition(node: Konva.Node) {
  const stage = node.getStage();
  if (!stage) return null;

  const transform = node.getAbsoluteTransform().copy();
  transform.invert();

  const pos = stage.getPointerPosition();
  if (!pos) return null;

  return transform.point(pos);
}
  const onDragOver = () => {
    const pos = stageRef.current?.getPointerPosition();
    if (!pos) return;
    // console.log("Dragging over canvas at", pos);
  }
  const dispatch = useAppDispatch();
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const container = stage.container();

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
    }

    const onDrop = (event: DragEvent) => {
      event.preventDefault();
      if(!event.dataTransfer) return;

      const data = event.dataTransfer.getData("application/component");
      if (!data) return;

      const component = JSON.parse(data);

      stage.setPointersPositions(event);

      const layer = stage.findOne<Konva.Layer>('Layer');
      if (!layer) return;

      const position = getRelativePointerPosition(layer);
      if (!position) return;

      dispatch(
        addComponent({
          ...component,
          x: position.x,
          y: position.y,
        })
      );

      console.log("Dropped on canvas", component);
    };
    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('drop', onDrop);

    return () => {
      container.removeEventListener('dragover', handleDragOver);
      container.removeEventListener('drop', onDrop);
    };
  }, []);
  
  return (
    <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef} onMouseMove={onDragOver}>
      <Layer>
        {componentList.map((component) => (
          <CanvasComponent {...component} key={component.key} />
        ))}
      </Layer>
    </Stage>
  );
}