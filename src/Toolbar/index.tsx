"use client";
import { COMPONENT_TYPES, CONNECTOR_TYPES } from "@/Utils/constants";
import { NODE_ICONS, CONNECTOR_ICONS } from "./Utils/constants";
import { ToolbarProps } from "./Utils/types";

export default function Toolbar({ selectedTool, onSelectTool, onDeleteSelected }: ToolbarProps) {
  return (
    <div
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 px-3 py-2 rounded-2xl"
      style={{
        background: "rgba(14, 14, 18, 0.85)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {/* Section label */}

      {COMPONENT_TYPES.map((comp) => (
        <button
          key={comp.id}
          onClick={() => onSelectTool(comp.id)}
          title={comp.description}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            padding: "8px 14px",
            borderRadius: 10,
            border: selectedTool === comp.id
              ? "1px solid rgba(108, 99, 255, 0.7)"
              : "1px solid transparent",
            background: selectedTool === comp.id
              ? "rgba(108, 99, 255, 0.18)"
              : "transparent",
            color: selectedTool === comp.id ? "#a79fff" : "rgba(255,255,255,0.5)",
            cursor: "pointer",
            transition: "all 0.15s ease",
            boxShadow: selectedTool === comp.id
              ? "0 0 12px rgba(108,99,255,0.3), inset 0 1px 0 rgba(255,255,255,0.08)"
              : "none",
          }}
          onMouseEnter={(e) => {
            if (selectedTool !== comp.id) {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.8)";
            }
          }}
          onMouseLeave={(e) => {
            if (selectedTool !== comp.id) {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.5)";
            }
          }}
        >
          <span style={{ fontSize: 16 }}>{NODE_ICONS[comp.id]}</span>
          <span style={{ fontSize: 8, letterSpacing: "0.12em" }}>{comp.label}</span>
        </button>
      ))}

      {/* Divider */}
      <div
        style={{
          width: 1,
          height: 32,
          background: "rgba(255,255,255,0.08)",
          margin: "0 6px",
        }}
      />


      {CONNECTOR_TYPES.map((conn) => (
        <button
          key={conn.id}
          onClick={() => onSelectTool(conn.id)}
          title={conn.description}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            padding: "8px 14px",
            borderRadius: 10,
            border: selectedTool === conn.id
              ? "1px solid rgba(74, 222, 128, 0.7)"
              : "1px solid transparent",
            background: selectedTool === conn.id
              ? "rgba(74, 222, 128, 0.12)"
              : "transparent",
            color: selectedTool === conn.id ? "#86efac" : "rgba(255,255,255,0.5)",
            cursor: "pointer",
            transition: "all 0.15s ease",
            boxShadow: selectedTool === conn.id
              ? "0 0 12px rgba(74,222,128,0.2)"
              : "none",
          }}
          onMouseEnter={(e) => {
            if (selectedTool !== conn.id) {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.8)";
            }
          }}
          onMouseLeave={(e) => {
            if (selectedTool !== conn.id) {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.5)";
            }
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>{CONNECTOR_ICONS[conn.id]}</span>
          <span style={{ fontSize: 8, letterSpacing: "0.12em" }}>{conn.label}</span>
        </button>
      ))}

      {/* Divider + Delete */}
      {onDeleteSelected && (
        <>
          <div
            style={{
              width: 1,
              height: 32,
              background: "rgba(255,255,255,0.08)",
              margin: "0 6px",
            }}
          />
          <button
            onClick={onDeleteSelected}
            title="Delete selected (Del)"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              padding: "8px 14px",
              borderRadius: 10,
              border: "1px solid rgba(248, 113, 113, 0.5)",
              background: "rgba(248, 113, 113, 0.1)",
              color: "#fca5a5",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <span style={{ fontSize: 14 }}>✕</span>
            <span style={{ fontSize: 8, letterSpacing: "0.12em" }}>DELETE</span>
          </button>
        </>
      )}
    </div>
  );
}