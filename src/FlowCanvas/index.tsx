"use client";

import { memo, useRef, useState, useCallback, useEffect, useMemo } from "react";
import Konva from "konva";
import { Stage, Layer, Circle, Arrow, Rect } from "react-konva";
import Toolbar from "../Toolbar";
import { COMPONENT_TYPES, CONNECTOR_TYPES } from "@/Utils/constants";
import { Node } from "@/Utils/types";
import Components from "@/Components";
import { getPortPosition, buildLinePath } from "./Utils/functions";
import { ConnectorType } from "@/Utils/types";
import { NodeType } from "@/Utils/types";
import TopRightComponents from "@/TopRightComponents";
import { GridDot, SelectionBox } from "./Utils/types";
import { MIN_ZOOM, MAX_ZOOM, ZOOM_STEP, GRID_OFFSET, GRID_SPACING } from "@/Toolbar/Utils/constants";

const GridLayer = memo(function GridLayer({ dots }: { dots: GridDot[] }) {
  return (
    <Layer>
      {dots.map((dot) => (
        <Circle
          key={dot.key}
          x={dot.x}
          y={dot.y}
          radius={1}
          fill="rgba(175, 172, 172, 0.919)"
          listening={false}
        />
      ))}
    </Layer>
  );
});

const SelectionLayer = memo(function SelectionLayer({ selectionBox }: { selectionBox: SelectionBox | null }) {
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
        dash={[8, 4]}
      />
    </Layer>
  );
});


const useFlowCanvas = () => {
  const stageRef = useRef<Konva.Stage>(null);
  const selectionStartRef = useRef<{ x: number; y: number } | null>(null);
  const draggedSelectionRef = useRef<Record<string, { x: number; y: number }> | null>(null);
  const suppressCanvasClickRef = useRef(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connectors, setConnectors] = useState<ConnectorType[]>([]);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [selectedNodeType, setSelectedNodeType] = useState<NodeType | null>(null);
  const [drawingConnector, setDrawingConnector] = useState<ConnectorType | null>(null);
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [stageScale, setStageScale] = useState(1);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });

  const getCanvasPointerPosition = useCallback((stage: Konva.Stage) => {
    const pointer = stage.getPointerPosition();
    if (!pointer) return null;

    return stage.getAbsoluteTransform().copy().invert().point(pointer);
  }, []);

  const clampScale = useCallback((value: number) => {
    return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value));
  }, []);

  const zoomStage = useCallback(
    (nextScale: number, center?: { x: number; y: number }) => {
      const stage = stageRef.current;
      if (!stage) return;

      const clampedScale = clampScale(nextScale);
      const focusPoint = center ?? {
        x: stageSize.width / 2,
        y: stageSize.height / 2,
      };

      const worldPoint = {
        x: (focusPoint.x - stagePosition.x) / stageScale,
        y: (focusPoint.y - stagePosition.y) / stageScale,
      };

      setStageScale(clampedScale);
      setStagePosition({
        x: focusPoint.x - worldPoint.x * clampedScale,
        y: focusPoint.y - worldPoint.y * clampedScale,
      });
    },
    [clampScale, stagePosition.x, stagePosition.y, stageScale, stageSize.height, stageSize.width]
  );
  // Place a node on canvas click when a component tool is active
  const handleCanvasClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (suppressCanvasClickRef.current) {
        suppressCanvasClickRef.current = false;
        return;
      }

      if (selectedTool && COMPONENT_TYPES.find((c) => c.id === selectedTool)) {
        const stage = e.target.getStage();
        if (!stage) return;

        const pos = getCanvasPointerPosition(stage);
        if (!pos) return;
        const def = COMPONENT_TYPES.find((c) => c.id === selectedTool)!;
        const uuid = crypto.randomUUID();
        const newNode: Node = {
          id: `node-${uuid}`,
          x: pos.x - def.width / 2,
          y: pos.y - def.height / 2,
          icon: def.icon,
          type: selectedTool,
          label: def.label,
          width: def.width,
          height: def.height,
          colors: def.colors,
        };
        setNodes((prev) => [...prev, newNode]);
        setSelectedTool(null);
        setSelectedNodeIds([]);
      } else {
        setSelectedNodeIds([]);
        setSelectedNodeType(null);
      }
    },
    [getCanvasPointerPosition, selectedTool]
  );

  const handleMouseMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      const stage = e.target.getStage();
      if (!stage) return;

      const pos = getCanvasPointerPosition(stage);
      if (!pos) return;

      if (selectionStartRef.current) {
        const start = selectionStartRef.current;
        setSelectionBox({
          x: Math.min(start.x, pos.x),
          y: Math.min(start.y, pos.y),
          width: Math.abs(pos.x - start.x),
          height: Math.abs(pos.y - start.y),
        });
      }

      if (drawingConnector) {
        setDrawingConnector((prev) =>
          prev ? { ...prev, tempEndX: pos.x, tempEndY: pos.y } : null
        );
      }
    },
    [drawingConnector, getCanvasPointerPosition]
  );

  const handlePortClick = useCallback(
    (nodeId: string, port: "right" | "bottom") => {
      if (selectedTool && CONNECTOR_TYPES.find((c) => c.id === selectedTool)) {
        const style = selectedTool === "connector-curved" ? "curved" : "straight";
        if (!drawingConnector) {
          // Start drawing connector
          const node = nodes.find((n) => n.id === nodeId)!;
          const portPos = getPortPosition(node, port);
          const uuid = crypto.randomUUID();
          setDrawingConnector({
            id: `conn-${uuid}`,
            fromNodeId: nodeId,
            toNodeId: null,
            fromPort: port,
            toPort: "left",
            style,
            tempEndX: portPos.x,
            tempEndY: portPos.y,
          });
        } else {
          // Complete connector
          if (drawingConnector.fromNodeId !== nodeId) {
            const completed: ConnectorType = {
              ...drawingConnector,
              toNodeId: nodeId,
              toPort: port === "right" ? "left" : "top",
            };
            setConnectors((prev) => [...prev, completed]);
          }
          setDrawingConnector(null);
          setSelectedNodeType(null);
          setSelectedTool(null);
        }
      }
    },
    [selectedTool, drawingConnector, nodes]
  );

  const handleNodeDragStart = useCallback((id: string) => {
    setSelectedNodeType(NodeType.COMPONENT);
    setSelectedNodeIds((prev) => {
      const effectiveSelection = prev.includes(id) ? prev : [id];
      const currentNodes = nodes.filter((node) => effectiveSelection.includes(node.id));
      draggedSelectionRef.current = Object.fromEntries(
        currentNodes.map((node) => [node.id, { x: node.x, y: node.y }])
      );
      return effectiveSelection;
    });
  }, [nodes]);

  const handleNodeDrag = useCallback((id: string, x: number, y: number) => {
    setNodes((prev) => {
      const activeSelection = selectedNodeIds.includes(id) ? selectedNodeIds : [id];
      const dragOrigin = draggedSelectionRef.current?.[id];
      if (!dragOrigin) {
        return prev.map((node) => (node.id === id ? { ...node, x, y } : node));
      }

      const deltaX = x - dragOrigin.x;
      const deltaY = y - dragOrigin.y;

      return prev.map((node) => {
        if (!activeSelection.includes(node.id)) return node;
        const origin = draggedSelectionRef.current?.[node.id];
        if (!origin) return node;
        return {
          ...node,
          x: origin.x + deltaX,
          y: origin.y + deltaY,
        };
      });
    });
  }, [selectedNodeIds]);

  const handleNodeDragEnd = useCallback(() => {
    draggedSelectionRef.current = null;
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (selectedNodeIds.length === 0) return;

    switch(selectedNodeType) {
      case NodeType.COMPONENT:
        setNodes((prev) => prev.filter((n) => !selectedNodeIds.includes(n.id)));
        setConnectors((prev) =>
          prev.filter(
            (c) => !selectedNodeIds.includes(c.fromNodeId) && (!c.toNodeId || !selectedNodeIds.includes(c.toNodeId))
          )
        );
        break;
      case NodeType.CONNECTOR:
        setConnectors((prev) => prev.filter((c) => !selectedNodeIds.includes(c.id)));

        break;
      }
      setSelectedNodeIds([]);
      setSelectedNodeType(null);
  }, [selectedNodeIds, selectedNodeType]);


  useEffect(() => {
    function handleResize() {
      setStageSize({ width: window.innerWidth, height: window.innerHeight });
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Delete" || e.key === "Backspace") handleDeleteSelected();
      if (e.key === "Escape") {
        setSelectedTool(null);
        setDrawingConnector(null);
        setSelectionBox(null);
        selectionStartRef.current = null;
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleDeleteSelected]);

  //TODO: there should ideally be a function where we can create a list of config for a particular node
  const isConnectorTool = selectedNodeType === NodeType.CONNECTOR

  const selectTool = (id: string, nodeType: NodeType) => {
    setSelectedTool((prev) => (prev === id ? null : id));
    setSelectedNodeType(nodeType);
    setDrawingConnector(null);
    setSelectionBox(null);
  }

  const helperStatements = () => {
    return isConnectorTool && !drawingConnector
          ? "Click a port (●) to start connecting"
          : isConnectorTool && drawingConnector
            ? "Click another port to complete the connection"
            : selectedTool
              ? "Click on canvas to place component"
              : "Select a tool from the toolbar"
  }

  const cursorStyle = () => {
    return isConnectorTool
            ? "crosshair"
            : selectedTool
              ? "copy"
              : "default"
  }

  const handleArrowClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>, id: string, nodeType: NodeType ) => {
    e.cancelBubble = true;
    setSelectedNodeType(nodeType);
    if (nodeType === NodeType.COMPONENT) {
      setSelectedNodeIds([id]);
    } else {
      setSelectedNodeIds([]);
    }
  }, []);

  const handleStageMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (selectedTool || drawingConnector) return;

    const stage = e.target.getStage();
    if (!stage || e.target !== stage) return;

    const pointer = getCanvasPointerPosition(stage);
    if (!pointer) return;

    selectionStartRef.current = pointer;
    setSelectionBox({
      x: pointer.x,
      y: pointer.y,
      width: 0,
      height: 0,
    });
    setSelectedNodeIds([]);
    setSelectedNodeType(null);
  }, [drawingConnector, getCanvasPointerPosition, selectedTool]);

  const handleStageMouseUp = useCallback(() => {
    const currentBox = selectionBox;
    selectionStartRef.current = null;

    if (!currentBox) return;

    const hasArea = currentBox.width > 4 || currentBox.height > 4;
    if (hasArea) {
      const nextSelectedIds = nodes
        .filter((node) => {
          const nodeLeft = node.x;
          const nodeTop = node.y;
          const nodeRight = node.x + node.width;
          const nodeBottom = node.y + node.height;

          return (
            nodeLeft >= currentBox.x &&
            nodeTop >= currentBox.y &&
            nodeRight <= currentBox.x + currentBox.width &&
            nodeBottom <= currentBox.y + currentBox.height
          );
        })
        .map((node) => node.id);

      setSelectedNodeIds(nextSelectedIds);
      setSelectedNodeType(nextSelectedIds.length > 0 ? NodeType.COMPONENT : null);
      suppressCanvasClickRef.current = true;
    }

    setSelectionBox(null);
  }, [nodes, selectionBox]);

  const handleStageWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();

      const stage = e.target.getStage();
      if (!stage) return;

      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const direction = e.evt.deltaY > 0 ? -1 : 1;
      const nextScale = direction > 0 ? stageScale * ZOOM_STEP : stageScale / ZOOM_STEP;
      zoomStage(nextScale, pointer);
    },
    [stageScale, zoomStage]
  );

  const handleZoomIn = useCallback(() => {
    zoomStage(stageScale * ZOOM_STEP);
  }, [stageScale, zoomStage]);

  const handleZoomOut = useCallback(() => {
    zoomStage(stageScale / ZOOM_STEP);
  }, [stageScale, zoomStage]);

  const handleResetZoom = useCallback(() => {
    setStageScale(1);
    setStagePosition({ x: 0, y: 0 });
  }, []);

  return {
    // refs
    stageRef,
    

    // states
    nodes,
    connectors,
    selectedNodeType, 
    selectedNodeIds,
    selectedTool,
    stageSize,
    drawingConnector,
    selectionBox,
    stageScale,
    stagePosition,


    // functions
    selectTool,
    handleDeleteSelected,
    helperStatements,
    handleNodeInsertion: handleCanvasClick,
    cursorStyle,
    handleMouseMove,
    handleArrowClick,
    handleStageMouseDown,
    handleStageMouseUp,
    handleNodeDragStart,
    handleNodeDrag,
    handleNodeDragEnd,
    handlePortClick,
    handleStageWheel,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
  }
}

export default function FlowCanvas() {
  const {
    // refs
    stageRef,
    

    // states
    nodes,
    connectors,
    selectedNodeType, 
    selectedNodeIds,
    selectedTool,
    stageSize,
    drawingConnector,
    selectionBox,
    stageScale,
    stagePosition,


    // functions
    selectTool,
    handleDeleteSelected,
    helperStatements,
    handleNodeInsertion,
    cursorStyle,
    handleMouseMove,
    handleArrowClick,
    handleStageMouseDown,
    handleStageMouseUp,
    handleNodeDragStart,
    handleNodeDrag,
    handleNodeDragEnd,
    handlePortClick,
    handleStageWheel,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
  } = useFlowCanvas();

  const isConnectorTool = selectedNodeType === NodeType.CONNECTOR
  const gridDots = useMemo(() => {
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

  return (
    <div className="relative w-full h-full select-none">
      {/* TopRightComponents */}
      <TopRightComponents
        zoomLevel={stageScale}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
      />

      {/* Toolbar */}
      <Toolbar
        selectedTool={selectedTool}
        componentSelected={selectedNodeIds.length > 0}
        onSelectTool={selectTool}
        onDeleteSelected={handleDeleteSelected}
      />

      {/* Canvas cursor hint */}
      <div
        className="absolute top-5 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          color: "rgb(175, 175, 175)",
          fontSize: 12,
          letterSpacing: "0.1em",
        }}
      >
        {helperStatements()}
      </div>

      {/* Configuration panel */}
      {/* {(
        <div className="absolute top-5 left-5 bg-white p-4 shadow-lg rounded-lg z-10 flex w-80 h-80 flex-col items-center justify-start">
          <TextInput/>
          <Slider/>
          <Switch/>
          <Select/>
        </div>
      )} */}

      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        x={stagePosition.x}
        y={stagePosition.y}
        scaleX={stageScale}
        scaleY={stageScale}
        onClick={handleNodeInsertion}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleStageMouseUp}
        onWheel={handleStageWheel}
        style={{
          cursor: cursorStyle(),
        }}
      >
        {/* Grid Layer */}
        <GridLayer dots={gridDots} />
        <SelectionLayer selectionBox={selectionBox} />

        {/* Connectors Layer */}
        <Layer>
          {connectors.map((conn) => {
            const fromNode = nodes.find((n) => n.id === conn.fromNodeId);
            const toNode = nodes.find((n) => n.id === conn.toNodeId);
            if (!fromNode || !toNode) return null;
            const from = getPortPosition(fromNode, conn.fromPort);
            const to = getPortPosition(toNode, conn.toPort);
            const pts = buildLinePath(from.x, from.y, to.x, to.y, conn.style);
            const isSelected = selectedNodeIds.includes(conn.id) && selectedNodeType === NodeType.CONNECTOR;
            return (
              <Arrow
                key={conn.id}
                points={pts}
                stroke={isSelected ? "#f59e0b" : "#6c63ff"}
                strokeWidth={isSelected ? 3 : 2}
                fill={isSelected ? "#f59e0b" : "#6c63ff"}
                pointerLength={10}
                pointerWidth={8}
                tension={0}
                onClick={(e) => handleArrowClick(e, conn.id, NodeType.CONNECTOR)}
                shadowColor={isSelected ? "#f59e0b" : "#6c63ff"}
                shadowBlur={isSelected ? 12 : 6}
                shadowOpacity={0.5}
              />
            );
          })}

          {/* In-progress connector */}
          {drawingConnector && drawingConnector.tempEndX !== undefined && (() => {
            const fromNode = nodes.find((n) => n.id === drawingConnector.fromNodeId);
            if (!fromNode) return null;
            const from = getPortPosition(fromNode, drawingConnector.fromPort);
            const pts = buildLinePath(
              from.x, from.y,
              drawingConnector.tempEndX!, drawingConnector.tempEndY!,
              drawingConnector.style
            );
            return (
              <Arrow
                points={pts}
                stroke="rgba(108,99,255,0.5)"
                strokeWidth={2}
                fill="rgba(108,99,255,0.5)"
                pointerLength={8}
                pointerWidth={7}
                dash={[6, 4]}
                listening={false}
              />
            );
          })()}
        </Layer>

        <Components
          nodes={nodes}
          selectedNodeIds={selectedNodeIds}
          isConnectorTool={isConnectorTool}
          handleArrowClick={handleArrowClick}
          handleNodeDragStart={handleNodeDragStart}
          handleNodeDrag={handleNodeDrag}
          handleNodeDragEnd={handleNodeDragEnd}
          handlePortClick={handlePortClick}
        />
      </Stage>
    </div>
  );
}
