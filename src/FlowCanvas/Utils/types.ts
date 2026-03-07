
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
