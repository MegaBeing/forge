# Konva Flow Canvas — Setup Guide

## 1. Install dependencies

```bash
npm install konva react-konva
```

> **Note**: `react-konva` requires `konva` as a peer dependency.

---

## 2. File structure

Place the files in your Next.js project like this:

```
src/
  app/
    canvas/
      page.tsx          ← canvas-page.tsx (rename)
  components/
    FlowCanvas.tsx
    Toolbar.tsx
    constants.ts
```

---

## 3. Add JetBrains Mono font (optional but recommended)

In your `app/layout.tsx` or `globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');
```

---

## 4. Tailwind config

Make sure your `tailwind.config.ts` includes the `src/components` path in `content`:

```ts
content: [
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
]
```

---

## 5. Usage

Navigate to `/canvas` in your app.

### Toolbar actions:
| Tool | Action |
|------|--------|
| ⚙ PROCESS | Click canvas to place a Process node |
| ◆ DECISION | Click canvas to place a Decision node |
| ⬡ DATA | Click canvas to place a Data node |
| → STRAIGHT | Click port → click another port to connect with straight line |
| ⤳ CURVED | Click port → click another port to connect with bezier curve |
| ✕ DELETE | Deletes selected node or connector |

### Keyboard shortcuts:
- `Delete` / `Backspace` — delete selected element
- `Escape` — cancel current tool / drawing

### Interaction:
- **Drag** nodes to reposition them (connectors follow automatically)
- **Click** a node or connector to select it
- Ports (●) appear on nodes when a connector tool is active