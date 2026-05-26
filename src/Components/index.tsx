"use client";
import { JSX, memo, useEffect, useState } from "react";
import { Node, NodeType } from "@/Utils/types";
import Konva from "konva";
import { Layer, Group, Rect, Circle, Text, Image as KonvaImage } from "react-konva";
import { renderToStaticMarkup } from "react-dom/server";

interface IProps {
  nodes: Node[];
  selectedNodeIds: string[];
  isConnectorTool: boolean;
  handleArrowClick: (e: Konva.KonvaEventObject<MouseEvent>, id: string, nodeType: NodeType) => void;
  handleNodeDragStart: (id: string) => void;
  handleNodeDrag: (id: string, x: number, y: number) => void;
  handleNodeDragEnd: () => void;
  handlePortClick: (nodeId: string, portPosition: "right" | "bottom") => void;
}
interface CanvasNodeProps {
  node: Node;
  isSelected: boolean;
  isConnectorTool: boolean;
  handleArrowClick: (e: Konva.KonvaEventObject<MouseEvent>, id: string, nodeType: NodeType) => void;
  handleNodeDragStart: (id: string) => void;
  handleNodeDrag: (id: string, x: number, y: number) => void;
  handleNodeDragEnd: () => void;
  handlePortClick: (nodeId: string, portPosition: "right" | "bottom") => void;
}

function useSvgIconImage(icon: JSX.Element) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const svg = renderToStaticMarkup(icon);
    const dataUrl = "data:image/svg+xml;base64," + btoa(svg);
    const image = new window.Image();
    image.src = dataUrl;
    image.onload = () => setImg(image);
  }, [icon]);

  return img;
}

const CanvasNode = memo(function CanvasNode({
  node,
  isSelected,
  isConnectorTool,
  handleArrowClick,
  handleNodeDragStart,
  handleNodeDrag,
  handleNodeDragEnd,
  handlePortClick,
}: CanvasNodeProps) {
  const colors = node.colors;
  const showPorts = isConnectorTool;
  const iconImage = useSvgIconImage(node.icon);
  console.log(iconImage)
  return (
    <Group
      x={node.x}
      y={node.y}
      draggable={!isConnectorTool}
      onDragStart={() => {
        handleNodeDragStart(node.id);
      }}
      onDragMove={(e) => {
        handleNodeDrag(node.id, e.target.x(), e.target.y());
      }}
      onDragEnd={() => {
        handleNodeDragEnd();
      }}
      onClick={(e) => handleArrowClick(e, node.id, NodeType.COMPONENT)}
    >
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

      {iconImage &&
        <KonvaImage
          x={(node.width - 24) / 2}
          y={(node.height - 24) / 3}
          image={iconImage}
          width={24}
          height={24}
          listening={false}
        />}

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

      {showPorts && (
        <>
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
}, (prevProps, nextProps) => {
  return (
    prevProps.node.x == nextProps.node.x &&
    prevProps.node.y == nextProps.node.y &&
    prevProps.isSelected == nextProps.isSelected 
  );
});

function Components({
  nodes,
  selectedNodeIds,
  isConnectorTool,
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

export default memo(Components);
