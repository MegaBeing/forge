export interface ZoomModalProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

const liquidGlassButtonStyle = {
  border: "1px solid rgba(255,255,255,0.22)",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.24), rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.16))",
  color: "rgba(255,255,255,0.9)",
  cursor: "pointer",
  transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, background 0.18s ease",
  backdropFilter: "blur(18px) saturate(165%)",
  WebkitBackdropFilter: "blur(18px) saturate(165%)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.32), inset 0 -10px 20px rgba(255,255,255,0.04), 0 10px 30px rgba(0,0,0,0.24)",
};

const liquidGlassHoverStyle = {
  border: "1px solid rgba(255,255,255,0.34)",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.34), rgba(255,255,255,0.12) 48%, rgba(160,190,255,0.22))",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.48), inset 0 -10px 22px rgba(255,255,255,0.07), 0 14px 36px rgba(0,0,0,0.28), 0 0 18px rgba(160,190,255,0.16)",
};

function applyLiquidGlassHover(button: HTMLButtonElement) {
  button.style.border = liquidGlassHoverStyle.border;
  button.style.background = liquidGlassHoverStyle.background;
  button.style.boxShadow = liquidGlassHoverStyle.boxShadow;
  button.style.transform = "translateY(-1px)";
}

function removeLiquidGlassHover(button: HTMLButtonElement) {
  button.style.border = liquidGlassButtonStyle.border;
  button.style.background = liquidGlassButtonStyle.background;
  button.style.boxShadow = liquidGlassButtonStyle.boxShadow;
  button.style.transform = "translateY(0)";
}

export default function ZoomModal({
  zoomLevel, 
  onResetZoom,
  onZoomIn,
  onZoomOut,
}: ZoomModalProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onZoomOut}
        title="Zoom out"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          borderRadius: 10,
          fontSize: 18,
          ...liquidGlassButtonStyle,
        }}
        onMouseEnter={(e) => applyLiquidGlassHover(e.currentTarget)}
        onMouseLeave={(e) => removeLiquidGlassHover(e.currentTarget)}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(0.96)";
        }}
        onMouseUp={(e) => applyLiquidGlassHover(e.currentTarget)}
      >
        -
      </button>

      <button
        onClick={onResetZoom}
        title="Reset zoom"
        style={{
          minWidth: 64,
          height: 36,
          padding: "0 10px",
          borderRadius: 10,
          fontSize: 10,
          letterSpacing: "0.12em",
          ...liquidGlassButtonStyle,
        }}
        onMouseEnter={(e) => applyLiquidGlassHover(e.currentTarget)}
        onMouseLeave={(e) => removeLiquidGlassHover(e.currentTarget)}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(0.97)";
        }}
        onMouseUp={(e) => applyLiquidGlassHover(e.currentTarget)}
      >
        {Math.round(zoomLevel * 100)}%
      </button>

      <button
        onClick={onZoomIn}
        title="Zoom in"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          borderRadius: 10,
          fontSize: 18,
          ...liquidGlassButtonStyle,
        }}
        onMouseEnter={(e) => applyLiquidGlassHover(e.currentTarget)}
        onMouseLeave={(e) => removeLiquidGlassHover(e.currentTarget)}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(0.96)";
        }}
        onMouseUp={(e) => applyLiquidGlassHover(e.currentTarget)}
      >
        +
      </button>
    </div>
  )
}
