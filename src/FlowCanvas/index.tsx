"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Konva from "konva";
import { Stage } from "react-konva";
import Toolbar from "../Toolbar";
import { DEFAULT_COMPONENT, CONNECTOR_TYPES } from "@/Utils/constants";
import { Node, PortPosition } from "@/Utils/types";
import NodesLayer from "@/FlowCanvas/NodesLayer";
import { getCursorStyle, getPortPosition } from "./Utils/functions";
import { ConnectorType } from "@/Utils/types";
import { NodeType } from "@/Utils/types";
import TopRightComponents from "@/TopBar";
import { SelectionBox, StagePositionType, StageSizeType } from "./Utils/types";
import { MIN_ZOOM, MAX_ZOOM, ZOOM_STEP } from "@/Toolbar/Utils/constants";
import ConfigurationPanel from "@/ConfigurationPanel";
import { GridLayer } from "./GridLayer";
import { SelectionLayer } from "./SelectionLayer";
import ConnectorsLayer from "./ConnectorsLayer";

const PORT_PROXIMITY_PX = 28;
const PORTS: PortPosition[] = ["right", "bottom", "left", "top"];

type ActivePort = {
  nodeId: string;
  port: PortPosition;
};

const useFlowCanvas = () => {
  const stageRef = useRef<Konva.Stage>(null);
  const selectionStartRef = useRef<StagePositionType | null>(null);
  const draggedSelectionRef = useRef<Record<string, StagePositionType> | null>(null);
  const suppressCanvasClickRef = useRef(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connectors, setConnectors] = useState<ConnectorType[]>([]);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [selectedNodeType, setSelectedNodeType] = useState<NodeType | null>(null);
  const [drawingConnector, setDrawingConnector] = useState<ConnectorType | null>(null);
  const [activePort, setActivePort] = useState<ActivePort | null>(null);
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
  const [stageSize, setStageSize] = useState<StageSizeType>({ width: 0, height: 0 });
  const [stageScale, setStageScale] = useState(1);
  const [stagePosition, setStagePosition] = useState<StagePositionType>({ x: 0, y: 0 });

  const getCanvasPointerPosition = useCallback((stage: Konva.Stage) => {
    const pointer = stage.getPointerPosition();
    if (!pointer) return null;

    return stage.getAbsoluteTransform().copy().invert().point(pointer);
  }, []);

  const clampScale = useCallback((value: number) => {
    return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value));
  }, []);

  const zoomStage = useCallback(
    (nextScale: number, center?: StagePositionType) => {
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

  const isComponentToolSelected = selectedTool === DEFAULT_COMPONENT.id;
  const isConnectorToolSelected = Boolean(
    selectedTool && CONNECTOR_TYPES.some((connector) => connector.id === selectedTool)
  );

  const getNearestPort = useCallback(
    (position: StagePositionType) => {
      const proximity = PORT_PROXIMITY_PX / stageScale;
      let nearestPort: ActivePort | null = null;
      let nearestDistance = proximity;

      nodes.forEach((node) => {
        PORTS.forEach((port) => {
          const portPosition = getPortPosition(node, port);
          const distance = Math.hypot(position.x - portPosition.x, position.y - portPosition.y);

          if (distance <= nearestDistance) {
            nearestDistance = distance;
            nearestPort = { nodeId: node.id, port };
          }
        });
      });

      return nearestPort;
    },
    [nodes, stageScale]
  );

  // Place a node on canvas click when a component tool is active
  const handleCanvasClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (suppressCanvasClickRef.current) {
        suppressCanvasClickRef.current = false;
        return;
      }

      if (isComponentToolSelected && DEFAULT_COMPONENT) {
        const stage = e.target.getStage();
        if (!stage) return;

        const pos = getCanvasPointerPosition(stage);
        if (!pos) return;

        const def = DEFAULT_COMPONENT;
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
          configuration: def.configuration
        };
        setNodes((prev) => [...prev, newNode]);
        setSelectedTool(null);
        setSelectedNodeIds([]);
        setSelectedNodeType(null);
      } else {
        setSelectedNodeIds([]);
        setSelectedNodeType(null);
      }
    },
    [getCanvasPointerPosition, isComponentToolSelected, selectedTool]
  );

  const handleMouseMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      const stage = e.target.getStage();
      if (!stage) return;

      const pos = getCanvasPointerPosition(stage);
      if (!pos) return;

      setActivePort(isConnectorToolSelected ? getNearestPort(pos) : null);

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
    [drawingConnector, getCanvasPointerPosition, getNearestPort, isConnectorToolSelected]
  );

  const handlePortClick = useCallback(
    (nodeId: string, port: PortPosition) => {
      if (isConnectorToolSelected) {
        const style = selectedTool === "connector-curved" ? "curved" : "straight";
        setDrawingConnector((currentConnector) => {
          if (!currentConnector) {
            const node = nodes.find((n) => n.id === nodeId);
            if (!node) return null;

            const portPos = getPortPosition(node, port);
            const uuid = crypto.randomUUID();
            return {
              id: `conn-${uuid}`,
              fromNodeId: nodeId,
              toNodeId: null,
              fromPort: port,
              toPort: port,
              style,
              tempEndX: portPos.x,
              tempEndY: portPos.y,
            };
          }

          if (currentConnector.fromNodeId !== nodeId) {
            const uuid = crypto.randomUUID();
            const completed: ConnectorType = {
              ...currentConnector,
              id: `conn-${uuid}`,
              toNodeId: nodeId,
              toPort: port,
            };
            setConnectors((prev) => [...prev, completed]);
          }

          setSelectedNodeType(null);
          setSelectedTool(null);
          setActivePort(null);
          return null;
        });
      }
    },
    [isConnectorToolSelected, nodes, selectedTool]
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

    switch (selectedNodeType) {
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

  const updateNode = (updatedNode: Node) => {
    setNodes((prev) => prev.map((n) => n.id === updatedNode.id ? updatedNode : n));
  };

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
      if (e.key === "Delete") handleDeleteSelected();
      if (e.key === "Escape") {
        setSelectedTool(null);
        setDrawingConnector(null);
        setActivePort(null);
        setSelectionBox(null);
        selectionStartRef.current = null;
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleDeleteSelected]);

  const selectTool = (id: string, nodeType: NodeType) => {
    const nextTool = selectedTool === id ? null : id;
    setSelectedTool(nextTool);
    setSelectedNodeType(nextTool ? nodeType : null);
    setDrawingConnector(null);
    setSelectionBox(null);
    setActivePort(null);
  }

  const cursorStyle = getCursorStyle(isConnectorToolSelected, selectedTool)

  const handleArrowClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>, id: string, nodeType: NodeType) => {
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
    isConnectorToolSelected,
    stageSize,
    drawingConnector,
    activePort,
    selectionBox,
    stageScale,
    stagePosition,


    // functions
    selectTool,
    handleDeleteSelected,
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
    updateNode
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
    isConnectorToolSelected,
    stageSize,
    drawingConnector,
    activePort,
    selectionBox,
    stageScale,
    stagePosition,


    // functions
    selectTool,
    handleDeleteSelected,
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
    updateNode
  } = useFlowCanvas();

  return (
    <div className="relative w-full h-full select-none">
      {/* TopRightComponents */}
      <TopRightComponents
        zoomLevel={stageScale}
        isConnectorTool={isConnectorToolSelected}
        drawingConnector={drawingConnector}
        selectedTool={selectedTool}
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

      {/* Configuration panel */}
      {selectedNodeIds.length === 1 &&
        <ConfigurationPanel
          node={nodes.find((n) => n.id === selectedNodeIds[0])!}
          updateNode={(data: Node) => updateNode(data)}
        />
      }

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
        <GridLayer
          stageSize={stageSize}
          stageScale={stageScale}
          stagePosition={stagePosition}
        />

        {/* Selection Layer */}
        <SelectionLayer selectionBox={selectionBox} />

        {/* Connectors Layer */}
        <ConnectorsLayer
          connectors={connectors}
          nodes={nodes}
          selectedNodeIds={selectedNodeIds}
          selectedNodeType={selectedNodeType}
          drawingConnector={drawingConnector}
          handleArrowClick={handleArrowClick}
        />

        {/* Nodes Layer */}
        <NodesLayer
          nodes={nodes}
          selectedNodeIds={selectedNodeIds}
          isConnectorTool={isConnectorToolSelected}
          activePort={activePort}
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
