import { NodeType } from "@/Utils/types";
import Konva from "konva";
import { Group, Rect, Circle, Text } from "react-konva";

interface IProps {
  node: NodeType;
  isConnectorTool: boolean;
  isSelected: boolean;
  colors: {
    fill: string;
    stroke: string;
    icon: string;
  };
  handleNodeDrag: (id: string, x: number, y: number) => void;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedConnectorId: (id: string | null) => void;
  handlePortClick: (nodeId: string, portPosition: "right" | "bottom") => void;
  showPorts: boolean;
}

export default function SingleComponent({
  node,
  isConnectorTool,
  isSelected,
  colors,
  handleNodeDrag,
  setSelectedNodeId,
  setSelectedConnectorId,
  handlePortClick,
  showPorts,
}: IProps) {
  return (
    <Group
      key={node.id}
      x={node.x}
      y={node.y}
      draggable={!isConnectorTool}
      onDragMove={(e) => {
        handleNodeDrag(node.id, e.target.x(), e.target.y());
      }}
      onClick={(e) => {
        e.cancelBubble = true;
        if (!isConnectorTool) {
          setSelectedNodeId(node.id);
          setSelectedConnectorId(null);
        }
      }}
    >
      {/* Glow */}
      {isSelected && (
        <Rect
          x={-4}
          y={-4}
          width={node.width + 8}
          height={node.height + 8}
          cornerRadius={14}
          fill="transparent"
          stroke={colors.stroke}
          strokeWidth={2}
          shadowColor={colors.stroke}
          shadowBlur={20}
          shadowOpacity={0.8}
          listening={false}
        />
      )}

      {/* Body */}
      <Rect
        width={node.width}
        height={node.height}
        cornerRadius={10}
        fill={colors.fill}
        stroke={isSelected ? colors.stroke : "rgba(255,255,255,0.1)"}
        strokeWidth={isSelected ? 2 : 1}
        shadowColor={colors.stroke}
        shadowBlur={isSelected ? 16 : 8}
        shadowOpacity={isSelected ? 0.5 : 0.2}
      />

      {/* Top accent bar */}
      <Rect
        x={10}
        y={0}
        width={node.width - 20}
        height={3}
        cornerRadius={[0, 0, 3, 3]}
        fill={colors.stroke}
        opacity={0.8}
        listening={false}
      />

      {/* Icon */}
      <Text
        x={0}
        y={12}
        width={node.width}
        text={colors.icon}
        fontSize={20}
        align="center"
        fill={colors.stroke}
        listening={false}
      />

      {/* Label */}
      <Text
        x={0}
        y={node.height - 28}
        width={node.width}
        text={node.label}
        fontSize={11}
        fontFamily="'JetBrains Mono', monospace"
        fontStyle="500"
        fill="rgba(255,255,255,0.7)"
        align="center"
        letterSpacing={1}
        listening={false}
      />

      {/* Ports (shown when connector tool active) */}
      {showPorts && (
        <>
          {/* Right port */}
          <Circle
            x={node.width}
            y={node.height / 2}
            radius={7}
            fill={colors.stroke}
            stroke="#fff"
            strokeWidth={1.5}
            shadowColor={colors.stroke}
            shadowBlur={10}
            onClick={(e) => {
              e.cancelBubble = true;
              handlePortClick(node.id, "right");
            }}
            onMouseEnter={(e) => {
              (e.target as Konva.Circle).radius(9);
              (e.target as Konva.Circle).getLayer()?.batchDraw();
            }}
            onMouseLeave={(e) => {
              (e.target as Konva.Circle).radius(7);
              (e.target as Konva.Circle).getLayer()?.batchDraw();
            }}
          />
          {/* Bottom port */}
          <Circle
            x={node.width / 2}
            y={node.height}
            radius={7}
            fill={colors.stroke}
            stroke="#fff"
            strokeWidth={1.5}
            shadowColor={colors.stroke}
            shadowBlur={10}
            onClick={(e) => {
              e.cancelBubble = true;
              handlePortClick(node.id, "bottom");
            }}
            onMouseEnter={(e) => {
              (e.target as Konva.Circle).radius(9);
              (e.target as Konva.Circle).getLayer()?.batchDraw();
            }}
            onMouseLeave={(e) => {
              (e.target as Konva.Circle).radius(7);
              (e.target as Konva.Circle).getLayer()?.batchDraw();
            }}
          />
          {/* Right port */}
          <Circle
            x={0}
            y={node.height / 2}
            radius={7}
            fill={colors.stroke}
            stroke="#fff"
            strokeWidth={1.5}
            shadowColor={colors.stroke}
            shadowBlur={10}
            onClick={(e) => {
              e.cancelBubble = true;
              handlePortClick(node.id, "right");
            }}
            onMouseEnter={(e) => {
              (e.target as Konva.Circle).radius(9);
              (e.target as Konva.Circle).getLayer()?.batchDraw();
            }}
            onMouseLeave={(e) => {
              (e.target as Konva.Circle).radius(7);
              (e.target as Konva.Circle).getLayer()?.batchDraw();
            }}
          />
          {/* Bottom port */}
          <Circle
            x={node.width / 2}
            y={0}
            radius={7}
            fill={colors.stroke}
            stroke="#fff"
            strokeWidth={1.5}
            shadowColor={colors.stroke}
            shadowBlur={10}
            onClick={(e) => {
              e.cancelBubble = true;
              handlePortClick(node.id, "bottom");
            }}
            onMouseEnter={(e) => {
              (e.target as Konva.Circle).radius(9);
              (e.target as Konva.Circle).getLayer()?.batchDraw();
            }}
            onMouseLeave={(e) => {
              (e.target as Konva.Circle).radius(7);
              (e.target as Konva.Circle).getLayer()?.batchDraw();
            }}
          />
        </>
      )}
    </Group>
  );
}