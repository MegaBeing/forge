"use client";
import { setComponent } from "@/lib/component";
import { useAppDispatch } from "@/lib/hooks";
import { IToolbarComponent } from "@/types/components";

export function Component({
  name = "Component",
  visible = true,
  className = " border border-gray-300 bg-white size-10 cursor-pointer rounded-2xl",
  icon = '/components/default.svg',
  activeIcon = '/components/default.svg',
}: IToolbarComponent) {
  const dragRef = useRef<HTMLImageElement>(null);
  const dispatch = useAppDispatch();
  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    console.log("Dragging", name);
    event.dataTransfer.setData(
      "application/component",
      JSON.stringify({ name, visible, icon })
    );
    const dt = event.dataTransfer;
    if(!dragRef.current) return;
    const ghost = dragRef.current.cloneNode(true) as HTMLElement;

    ghost.style.position = "absolute";
    ghost.style.top = "0px";
    ghost.style.left = "0px";
    ghost.style.width = "50px";
    ghost.style.opacity = "0.85";
    ghost.style.pointerEvents = "none";
    ghost.style.backgroundColor = "transparent";
    ghost.style.border = "0 none";
    ghost.style.translate = "-50% -50%";

    document.body.appendChild(ghost);

    dt.setDragImage(ghost, 20, 20);

    // Cleanup AFTER browser takes snapshot
    requestAnimationFrame(() => {
      document.body.removeChild(ghost);
    });
    dispatch(setComponent(true));
  }
  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // REQUIRED
  };
  return (
    <div className={className} 
    onDragStart={onDragStart} 
    onDragOver={onDragOver}
    draggable
    >
      <div className="relative inline-block group">
        <img src={icon} alt={name} ref={dragRef}/>

        <div
          className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2
                rounded bg-gray-900 px-2 py-1 text-xs text-white
                opacity-0 transition-opacity duration-200
                group-hover:opacity-100 pointer-events-none whitespace-nowrap"
        >
          {name}
        </div>
      </div>
    </div>
  );
}

import { ICanvasComponent } from "@/types/components";
import { useRef } from "react";
import { Image } from "react-konva";
import useImage from "use-image";

export function CanvasComponent({
  x = 0,
  y = 0,
  name = "Component",
  icon = '/components/default.svg',
}: ICanvasComponent) {
  const [iconImage] = useImage(icon);
  console.log("Rendering CanvasComponent", {x, y, name, icon});
  return (
    <Image
      x={x}
      y={y}
      width={50}
      height={50}
      image={iconImage}
      draggable
    />
  );
}