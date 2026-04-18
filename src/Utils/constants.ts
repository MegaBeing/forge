export const COMPONENT_TYPES = [
  {
    id: "server",
    label: "Server",
    width: 140,
    height: 80,
    description: "A processing step",
    colors: { fill: "#1a1a2e", stroke: "#6c63ff", icon: "⚙" } 
  },
  {
    id: "client",
    label: "Client",
    width: 140,
    height: 80,
    description: "A branching condition",
    colors: { fill: "#1a2a1a", stroke: "#4ade80", icon: "◆" }
  },
  {
    id: "database",
    label: "Database",
    width: 140,
    height: 80,
    description: "A data input/output",
    colors: { fill: "#1a2030", stroke: "#38bdf8", icon: "⬡" }
  },
  {
    id: "other-comp",
    label: "Other Components",
    width: 140,
    height: 80,
    description: "A data input/output",
    colors: { fill: "#1a2030", stroke: "#38bdf8", icon: "⬡" }
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

