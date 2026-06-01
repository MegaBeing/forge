import { ConnectorType, Node, NodeType } from "@/Utils/types";
import { Layer, Arrow } from "react-konva";
import { getPortPosition, buildLinePath } from "../Utils/functions";
import Konva from "konva";

interface IProps {
  connectors: ConnectorType[];
  nodes: Node[];
  selectedNodeIds: string[];
  selectedNodeType: NodeType | null;
  drawingConnector: ConnectorType | null;
  handleArrowClick: (e: Konva.KonvaEventObject<MouseEvent>, id: string, nodeType: NodeType) => void;
}

export default function ConnectorsLayer({
  connectors,
  nodes,
  selectedNodeIds,
  selectedNodeType,
  drawingConnector,
  handleArrowClick
}: IProps) {
  return (<Layer>
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
          shadowOpacity={0.5} />
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
          listening={false} />
      );
    })()}
  </Layer>);
}
