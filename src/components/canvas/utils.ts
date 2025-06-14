import type Konva from "konva";

export const handleZoom = (
    e: Konva.KonvaEventObject<WheelEvent>,
    scale: number,
    stage: Konva.Stage,
    position: { x: number; y: number },
    setScale: React.Dispatch<React.SetStateAction<number>>,
    setPosition: React.Dispatch<React.SetStateAction<{
        x: number;
        y: number;
    }>>) => {
    const oldScale = scale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const scaleBy = 1.1;
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    // Calculate the new position to keep the pointer at the same spot
    const mousePointTo = {
        x: (pointer.x - position.x) / oldScale,
        y: (pointer.y - position.y) / oldScale,
    };

    const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
    };

    setScale(newScale);
    setPosition(newPos);
}