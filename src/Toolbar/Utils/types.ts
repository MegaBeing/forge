import { NodeType } from "@/Utils/types";

export type ToolbarProps = {
  // values
  selectedTool: string | null;
  componentSelected: boolean;

  // callbacks
  onSelectTool: (id: string, nodeType: NodeType) => void;
  onDeleteSelected: () => void;
};
