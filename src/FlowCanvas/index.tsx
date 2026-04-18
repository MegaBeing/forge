"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Konva from "konva";
import { Stage, Layer, Circle, Arrow } from "react-konva";
import Toolbar from "../Toolbar";
import { COMPONENT_TYPES, CONNECTOR_TYPES } from "@/Utils/constants";
import { Node } from "@/Utils/types";
import Components from "@/Components";
import { getPortPosition, buildLinePath } from "./Utils/functions";
import { ConnectorType } from "@/Utils/types";
import { NodeType } from "@/Utils/types";

let nodeIdCounter = 1;
let connectorIdCounter = 1;


const useFlowCanvas = () => {
  const stageRef = useRef<Konva.Stage>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connectors, setConnectors] = useState<ConnectorType[]>([]);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedNodeType, setSelectedNodeType] = useState<NodeType | null>(null);
  const [drawingConnector, setDrawingConnector] = useState<ConnectorType | null>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  // Place a node on canvas click when a component tool is active
  const handleCanvasClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      // Only if clicking empty stage

      if (selectedTool && COMPONENT_TYPES.find((c) => c.id === selectedTool)) {
        const pos = e.target.getStage()!.getPointerPosition()!;
        const def = COMPONENT_TYPES.find((c) => c.id === selectedTool)!;
        const newNode: Node = {
          id: `node-${nodeIdCounter++}`,
          x: pos.x - def.width / 2,
          y: pos.y - def.height / 2,
          type: selectedTool,
          label: def.label,
          width: def.width,
          height: def.height,
          colors: def.colors,
        };
        setNodes((prev) => [...prev, newNode]);
        setSelectedTool(null);
      } else {
        setSelectedNodeId(null);
        setSelectedNodeType(null);
      }
    },
    [selectedTool]
  );

  const handleMouseMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!drawingConnector) return;
      const pos = e.target.getStage()!.getPointerPosition()!;
      setDrawingConnector((prev) =>
        prev ? { ...prev, tempEndX: pos.x, tempEndY: pos.y } : null
      );
    },
    [drawingConnector]
  );

  const handlePortClick = useCallback(
    (nodeId: string, port: "right" | "bottom") => {
      if (selectedTool && CONNECTOR_TYPES.find((c) => c.id === selectedTool)) {
        const style = selectedTool === "connector-curved" ? "curved" : "straight";
        if (!drawingConnector) {
          // Start drawing connector
          const node = nodes.find((n) => n.id === nodeId)!;
          const portPos = getPortPosition(node, port);
          setDrawingConnector({
            id: `conn-${connectorIdCounter++}`,
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

  const handleNodeDrag = useCallback((id: string, x: number, y: number) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, x, y } : n)));
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if(!selectedNodeId) return; 
    console.log(1, selectedNodeId, selectedNodeType)
    switch(selectedNodeType) {
      case NodeType.COMPONENT:
        setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId));
        setConnectors((prev) =>
          prev.filter(
            (c) => c.fromNodeId !== selectedNodeId && c.toNodeId !== selectedNodeId
          )
        );
        
        break;
      case NodeType.CONNECTOR:
        setConnectors((prev) => prev.filter((c) => c.id !== selectedNodeId));

        break;
      }
      setSelectedNodeId(null);
  }, [selectedNodeId, selectedNodeType]);


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

  const handleArrowClick = (e: Konva.KonvaEventObject<MouseEvent>, id: string, nodeType: NodeType ) => {
    e.cancelBubble = true;
    setSelectedNodeId(id);
    setSelectedNodeType(nodeType);
  }
  return {
    // refs
    stageRef,
    

    // states
    nodes,
    connectors,
    selectedNodeType, 
    selectedNodeId,
    selectedTool,
    stageSize,
    drawingConnector,


    // functions
    selectTool,
    handleDeleteSelected,
    helperStatements,
    handleNodeInsertion: handleCanvasClick,
    cursorStyle,
    handleMouseMove,
    handleArrowClick,
    handleNodeDrag,
    handlePortClick
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
    selectedNodeId,
    selectedTool,
    stageSize,
    drawingConnector,


    // functions
    selectTool,
    handleDeleteSelected,
    helperStatements,
    handleNodeInsertion,
    cursorStyle,
    handleMouseMove,
    handleArrowClick,
    handleNodeDrag,
    handlePortClick
  } = useFlowCanvas();

  const isConnectorTool = selectedNodeType === NodeType.CONNECTOR
  return (
    <div className="relative w-full h-full select-none">
      {/* Toolbar */}
      <Toolbar
        selectedTool={selectedTool}
        componentSelected={selectedNodeId ? true : false}
        onSelectTool={selectTool}
        onDeleteSelected={handleDeleteSelected}
      />

      {/* Canvas cursor hint */}
      <div
        className="absolute top-5 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          color: "rgb(15, 13, 13)",
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
        onClick={handleNodeInsertion}
        onMouseMove={handleMouseMove}
        style={{
          cursor: cursorStyle(),
        }}
      >
        {/* Grid Layer */}
        <Layer>
          {Array.from({ length: Math.ceil(stageSize.height / 32) }, (_, i) =>
            Array.from({ length: Math.ceil(stageSize.width / 32) }, (_, j) => (
              <Circle
                key={`dot-${i}-${j}`}
                x={j * 32 + 16}
                y={i * 32 + 16}
                radius={1}
                fill="rgba(0, 0, 0, 0.919)"
                listening={false}
              />
            ))
          )}
        </Layer>

        {/* Connectors Layer */}
        <Layer>
          {connectors.map((conn) => {
            const fromNode = nodes.find((n) => n.id === conn.fromNodeId);
            const toNode = nodes.find((n) => n.id === conn.toNodeId);
            if (!fromNode || !toNode) return null;
            const from = getPortPosition(fromNode, conn.fromPort);
            const to = getPortPosition(toNode, conn.toPort);
            const pts = buildLinePath(from.x, from.y, to.x, to.y, conn.style);
            const isSelected = conn.id === selectedNodeId;
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
          selectedNodeId={selectedNodeId}
          isConnectorTool={isConnectorTool}
          handleArrowClick={handleArrowClick}
          handleNodeDrag={handleNodeDrag}
          handlePortClick={handlePortClick}
        />
      </Stage>
    </div>
  );
}