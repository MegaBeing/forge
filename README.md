# Flow Canvas

A node-based flow canvas built with [Konva.js](https://konvajs.org/) and [Next.js](https://nextjs.org/). Drop components onto the canvas, connect them with straight or curved arrows, drag to reposition, and delete with a keypress.

---

## Preview

```
┌───────────────────────────────────────────────────────────┐
│  ⚙ PROCESS  ◆ DECISION  ⬡ DATA  │  → STRAIGHT  ⤳ CURVED  │
└───────────────────────────────────────────────────────────┘
                     ↑ Toolbar

        ┌───────────┐        ┌───────────┐
        │ ⚙         │ ──────▶│ ◆         │
        │  PROCESS  │        │  DECISION │
        └───────────┘        └───────────┘
```

---

## Tech Stack

- **Next.js 14+** (App Router)
- **React 18**
- **Konva.js** — 2D canvas rendering
- **react-konva** — React bindings for Konva
- **Tailwind CSS** — utility styling

---

## Getting Started

### 1. Install dependencies

```bash
npm install konva react-konva
```

### 2. File structure

```
src/
  app/
    layout.tsx          # Root layout (html + body tags)
    globals.css         # Global styles + font import
    canvas/
      page.tsx          # Canvas route (/canvas)
  components/
    FlowCanvas.tsx      # Main canvas component
    Toolbar.tsx         # Tool selection toolbar
    constants.ts        # Component & connector definitions
```

### 3. Run the dev server

```bash
npm run dev
```

Navigate to [http://localhost:3000/canvas](http://localhost:3000/canvas).

---

## Usage

### Placing components

1. Click a component button in the toolbar (**⚙ PROCESS**, **◆ DECISION**, or **⬡ DATA**)
2. Click anywhere on the canvas to place it
3. Drag placed nodes to reposition them

### Connecting components

1. Click a connector button (**→ STRAIGHT** or **⤳ CURVED**)
2. Ports (●) will appear on all nodes
3. Click a port on the source node to begin drawing
4. Click a port on the destination node to complete the connection

### Deleting elements

- Click a node or connector to select it (highlighted in amber)
- Press `Delete` / `Backspace`, or click the **✕ DELETE** button in the toolbar

### Keyboard shortcuts

| Key | Action |
|-----|--------|
| `Delete` / `Backspace` | Delete selected element |
| `Escape` | Cancel active tool / abort in-progress connection |

---

## Components

### `FlowCanvas.tsx`
The root canvas component. Manages all state: nodes, connectors, active tool, selection, and in-progress connector drawing. Renders three Konva layers: dot grid, connectors, and nodes.

### `Toolbar.tsx`
Floating toolbar centered at the top of the canvas. Highlights the active tool and conditionally shows the delete button when something is selected.

### `constants.ts`
Defines the available component types (id, label, dimensions) and connector types. Extend this file to add new node or connector variants.

---

## Adding New Node Types

In `constants.ts`, add an entry to `COMPONENT_TYPES`:

```ts
{
  id: "start",
  label: "START",
  width: 140,
  height: 80,
  description: "A start/end terminal",
}
```

Then add its color config in `FlowCanvas.tsx`:

```ts
const NODE_COLORS = {
  // ...existing entries
  start: { fill: "#1a1520", stroke: "#e879f9", icon: "◉" },
};
```

---

## Known Limitations

- No zoom / pan on the canvas (planned)
- Connectors do not re-route automatically around nodes
- No undo/redo history
- State is in-memory only — refreshing the page clears the canvas