import { ConnectorType } from "@/Utils/types";

export function getHelperStatements(isConnectorTool: boolean, drawingConnector: ConnectorType | null, selectedTool: string | null) {
  return () => {
    return isConnectorTool && !drawingConnector
      ? "Click a port (●) to start connecting"
      : isConnectorTool && drawingConnector
        ? "Click another port to complete the connection"
        : selectedTool
          ? "Click on canvas to place component"
          : "Select a tool from the toolbar";
  };
}
