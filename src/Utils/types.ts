import { ConfigurationPanelType } from "@/ConfigurationPanel";
import { JSX } from "react";

export type Node = {
  id: string;
  x: number;
  y: number;
  type: string;
  icon: JSX.Element
  label: string;
  width: number;
  height: number;
  colors: { fill: string; stroke: string; };
  // configuration: Configuration
  configuration: {
    type: ConfigurationPanelType;
    data: NodeConfigurationType
  };
};

export type NodeConfigurationType = {
  ram?: number;
  cpu?: number;
  storage?: number;
  iops?: number;
  network?:number;
  taskType?: number;
  requestTypeCombination?: number;
  requestPerSecond?: number;
  queueCapacity?: number;
  rateLimit?: number;
  hitRate?: number;
}

export type ConnectorType = {
  id: string;
  fromNodeId: string;
  toNodeId: string | null;
  fromPort: PortPosition;
  toPort: PortPosition;
  style: "straight" | "curved";
  // For in-progress connectors
  tempEndX?: number;
  tempEndY?: number;
};

export type PortPosition = "right" | "bottom" | "left" | "top";

export enum NodeType {
  COMPONENT = "COMPONENT",
  CONNECTOR = "CONNECTOR"
}

export enum InputType {
  TEXT = "TEXT",
  SELECT = "SELECT",
  SWITCH = "SWITCH",
  SLIDER = "SLIDER"
}


