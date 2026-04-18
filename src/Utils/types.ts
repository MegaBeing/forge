export type Node = {
  id: string;
  x: number;
  y: number;
  type: string;
  label: string;
  width: number;
  height: number;
  colors: { fill: string; stroke: string; icon: string; };
};

export type ConnectorType = {
  id: string;
  fromNodeId: string;
  toNodeId: string | null;
  fromPort: "right" | "bottom";
  toPort: "left" | "top";
  style: "straight" | "curved";
  // For in-progress connectors
  tempEndX?: number;
  tempEndY?: number;
};

export enum NodeType {
  COMPONENT = "COMPONENT",
  CONNECTOR = "CONNECTOR"
}



