import { NodeType } from "@/Utils/types";

export function getPortPosition(node: NodeType, port: string) {
  switch (port) {
    case "right":
      return { x: node.x + node.width, y: node.y + node.height / 2 };
    case "left":
      return { x: node.x, y: node.y + node.height / 2 };
    case "bottom":
      return { x: node.x + node.width / 2, y: node.y + node.height };
    case "top":
      return { x: node.x + node.width / 2, y: node.y };
    default:
      return { x: node.x + node.width, y: node.y + node.height / 2 };
  }
}

export function buildLinePath(
  x1: number, y1: number, x2: number, y2: number, style: string): number[] {
  if (style === "curved") {
    const cp1x = x1 + (x2 - x1) * 0.5;
    const cp1y = y1;
    const cp2x = x1 + (x2 - x1) * 0.5;
    const cp2y = y2;
    // Approximate bezier with segments
    const pts: number[] = [];
    const steps = 24;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const bx = Math.pow(1 - t, 3) * x1 +
        3 * Math.pow(1 - t, 2) * t * cp1x +
        3 * (1 - t) * Math.pow(t, 2) * cp2x +
        Math.pow(t, 3) * x2;
      const by = Math.pow(1 - t, 3) * y1 +
        3 * Math.pow(1 - t, 2) * t * cp1y +
        3 * (1 - t) * Math.pow(t, 2) * cp2y +
        Math.pow(t, 3) * y2;
      pts.push(bx, by);
    }
    return pts;
  }
  return [x1, y1, x2, y2];
}
