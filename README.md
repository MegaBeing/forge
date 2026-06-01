# Forge
<img width="2549" height="1315" alt="Forge" src="https://github.com/user-attachments/assets/20741947-8f58-413d-bee3-949fe4c0eeb0" />

Forge is a work-in-progress system design visualizer and simulator.

The goal is to make it easy to sketch distributed systems, connect components, configure their capacity, and eventually simulate how traffic moves through the design. Think of it as a canvas for architecture diagrams that can grow into a lightweight performance playground.

## What Forge Is Trying To Build

Most system design tools stop at static diagrams. Forge is meant to go further:

- Draw a system architecture visually.
- Add infrastructure components like servers, databases, clients, caches, and load balancers.
- Connect components with straight or curved connectors.
- Configure component-level resources such as RAM, CPU, storage, network capacity, and task type.
- Simulate system behavior with metrics such as requests per second, throughput, bottlenecks, latency, queue pressure, and resource utilization.

The simulator is still under active development, but the editor foundation is already in place.

## Current Features

- Infinite-style canvas built with Konva and React Konva.
- Add and move system components on the canvas.
- Select, delete, and multi-select nodes.
- Connect nodes using straight or curved connectors.
- Zoom controls and grid rendering.
- Configuration panel for selected nodes.
- Inline node label editing.
- Node icon and color customization with Lucide icons.
- Server configuration form for resource settings.

## Planned Direction

Forge is heading toward an interactive simulation layer where a design can be evaluated, not just drawn.

Planned simulation ideas include:

- Requests per second flowing from clients through the system.
- Component capacity limits based on configured CPU, RAM, network, and storage.
- Load balancer queue capacity and rate limits.
- Cache hit rate effects.
- Database IOPS and storage pressure.
- Visual bottleneck indicators on overloaded nodes or connectors.
- Per-node metrics panels for throughput, dropped requests, latency, and utilization.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Konva / React Konva
- React Hook Form
- Zod
- Lucide React

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build the app:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

## Project Status

Forge is early and actively changing. The visual editor is the current focus; the simulation model and metrics engine are the next major pieces.

Expect rough edges, incomplete component types, and evolving configuration schemas while the core interaction model settles.
