"use client";

import dynamic from "next/dynamic";

const FlowCanvas = dynamic(() => import("@/FlowCanvas"), {
  ssr: false,
});

export default function CanvasPage() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-[#313030]">
      <FlowCanvas />
    </main>
  );
}