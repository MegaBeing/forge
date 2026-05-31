import { Puzzle } from "lucide-react";
import { Node } from "./types";
import { ConfigurationPanelType } from "@/ConfigurationPanel";

export const DEFAULT_COMPONENT: Node = {
  id: "component",
  label: "Component",
  width: 140,
  height: 80,
  icon: <Puzzle size={16} color="#4ade80" />,
  colors: { fill: "#1a2a1a", stroke: "#4ade80" },
  x: 0,
  y: 0,
  type: "",
  configuration: {
    type: ConfigurationPanelType.NONE,
    data: {}
  }
}

export const CONNECTOR_TYPES = [
  {
    id: "connector-straight",
    label: "STRAIGHT",
    description: "A straight line connector",
  },
  {
    id: "connector-curved",
    label: "CURVED",
    description: "A smooth bezier connector",
  },
];

