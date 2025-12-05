"use client";

import { useFlowStore } from "@/lib/store";
import {
  Background,
  type ColorMode,
  Controls,
  MiniMap,
  type NodeTypes,
  ReactFlow,
  type ReactFlowInstance,
  ReactFlowProvider,
} from "@xyflow/react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import AddNode from "./nodes/AddNode";
import ComplementaryNode from "./nodes/ComplementaryNode";
import InputColorNode from "./nodes/InputColorNode";
import InputNumberNode from "./nodes/InputNumberNode";
import InvertNode from "./nodes/InvertNode";
import LightenNode from "./nodes/LightenNode";
import MixNode from "./nodes/MixNode";
import MultiplyNode from "./nodes/MultiplyNode";
import OutputNode from "./nodes/OutputNode";
import RotateNode from "./nodes/RotateNode";
import SaturateNode from "./nodes/SaturateNode";

const nodeTypes: NodeTypes = {
  inputColor: InputColorNode,
  inputNumber: InputNumberNode,
  output: OutputNode,
  lighten: LightenNode,
  darken: LightenNode,
  saturate: SaturateNode,
  desaturate: SaturateNode,
  rotate: RotateNode,
  mix: MixNode,
  invert: InvertNode,
  complementary: ComplementaryNode,
  add: AddNode,
  subtract: AddNode,
  multiply: MultiplyNode,
  divide: MultiplyNode,
};

const FlowEditorInner = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);
  const handleNodesChange = useFlowStore((state) => state.handleNodesChange);
  const handleEdgesChange = useFlowStore((state) => state.handleEdgesChange);
  const onConnect = useFlowStore((state) => state.onConnect);
  const onDropFromStore = useFlowStore((state) => state.onDrop);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance;
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!reactFlowInstance.current) {
        return;
      }
      const position = reactFlowInstance.current.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      onDropFromStore(event, position);
    },
    [onDropFromStore]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div className="h-full w-full" ref={reactFlowWrapper}>
      <ReactFlow
        colorMode={mounted ? ((theme as ColorMode) ?? "system") : undefined}
        // biome-ignore lint/suspicious/noExplicitAny: ReactFlow requires specific edge/node types that don't match our CustomEdge/CustomNode exactly
        edges={edges as any}
        fitView
        // biome-ignore lint/suspicious/noExplicitAny: ReactFlow requires specific edge/node types that don't match our CustomEdge/CustomNode exactly
        nodes={nodes as any}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onEdgesChange={handleEdgesChange}
        onInit={onInit}
        onNodesChange={handleNodesChange}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

const FlowEditor = () => (
  <ReactFlowProvider>
    <FlowEditorInner />
  </ReactFlowProvider>
);

export default FlowEditor;
