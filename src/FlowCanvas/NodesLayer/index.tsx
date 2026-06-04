"use client";
import { memo } from "react";
import { Node, NodeType, PortPosition } from "@/Utils/types";
import Konva from "konva";
import { Layer } from "react-konva";
import { CanvasNode } from "./CanvasNode";

interface IProps {
  nodes: Node[];
  selectedNodeIds: string[];
  isConnectorTool: boolean;
  activePort: { nodeId: string; port: PortPosition } | null;
  handleArrowClick: (e: Konva.KonvaEventObject<MouseEvent>, id: string, nodeType: NodeType) => void;
  handleNodeDragStart: (id: string) => void;
  handleNodeDrag: (id: string, x: number, y: number) => void;
  handleNodeDragEnd: () => void;
  handlePortClick: (nodeId: string, portPosition: PortPosition) => void;
}

function NodesLayer({
  nodes,
  selectedNodeIds,
  isConnectorTool,
  activePort,
  handleArrowClick,
  handleNodeDragStart,
  handleNodeDrag,
  handleNodeDragEnd,
  handlePortClick,
}: IProps) {
  return (
    <Layer>
      {nodes.map((node) => (
        <CanvasNode
          key={node.id}
          node={node}
          isSelected={selectedNodeIds.includes(node.id)}
          isConnectorTool={isConnectorTool}
          visiblePort={activePort?.nodeId === node.id ? activePort.port : null}
          handleArrowClick={handleArrowClick}
          handleNodeDragStart={handleNodeDragStart}
          handleNodeDrag={handleNodeDrag}
          handleNodeDragEnd={handleNodeDragEnd}
          handlePortClick={handlePortClick}
        />
      ))}
    </Layer>
  );
}

export default memo(NodesLayer);
