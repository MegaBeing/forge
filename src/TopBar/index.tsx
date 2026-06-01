import { ConnectorType } from "@/Utils/types";
import { getHelperStatements } from "./Utils/functions";
import ZoomModal from "./Zoom";

export interface TopRightComponentsProps {
  zoomLevel: number;
  isConnectorTool: boolean;
  drawingConnector: ConnectorType | null;
  selectedTool: string | null;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}
export default function TopRightComponents({
  zoomLevel,
  isConnectorTool,
  drawingConnector,
  selectedTool,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}: TopRightComponentsProps) {
  const helperStatements = getHelperStatements(isConnectorTool, drawingConnector, selectedTool)
  return (
    <>
      <div
        className="absolute top-6 right-6 z-10 flex items-center gap-2"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {/* Zoom controls */}
        <ZoomModal
          zoomLevel={zoomLevel}
          onResetZoom={onResetZoom}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
        />
      </div>
      <div
        className="absolute top-5 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          color: "rgb(175, 175, 175)",
          fontSize: 12,
          letterSpacing: "0.1em",
        }}
      >
        {helperStatements()}
      </div>
    </>
  );
}