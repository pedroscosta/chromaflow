"use client";

import { useFlowStore } from "@/lib/store";
import {
  Background,
  ColorMode,
  Controls,
  MiniMap,
  NodeTypes,
  ReactFlow,
  ReactFlowProvider
} from "@xyflow/react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import AddNode from "./nodes/AddNode";
import InputColorNode from "./nodes/InputColorNode";
import InputNumberNode from "./nodes/InputNumberNode";
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
  add: AddNode,
  subtract: AddNode,
  multiply: MultiplyNode,
  divide: MultiplyNode,
};

const FlowEditor = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
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

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!reactFlowWrapper.current) return;
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      onDropFromStore(event, reactFlowBounds);
    },
    [onDropFromStore]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <ReactFlowProvider>
      <div className="w-full h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes as any}
          edges={edges as any}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          colorMode={mounted ? (theme as ColorMode) ?? "system" : undefined}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default FlowEditor;

