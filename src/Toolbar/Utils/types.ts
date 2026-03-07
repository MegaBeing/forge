
export type ToolbarProps = {
  selectedTool: string | null;
  onSelectTool: (id: string) => void;
  onDeleteSelected?: () => void;
};
