import { Puzzle } from "lucide-react";

export const COMPONENT_TYPES = [
  {
    id: "component",
    label: "Component",
    width: 140,
    height: 80,
    description: "A branching condition",
    icon: <Puzzle size={16} color="#4ade80" />,
    colors: { fill: "#1a2a1a", stroke: "#4ade80"},
  },
];

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

