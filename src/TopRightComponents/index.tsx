import ZoomModal from "./Zoom";

export interface TopRightComponentsProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}
export default function TopRightComponents({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}: TopRightComponentsProps) {
  return (
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
  );
}