"use client";

import { Handle, type HandleProps, useNodeId } from "@xyflow/react";
import { useMemo } from "react";
// biome-ignore lint/style/useFilenamingConvention: component name matches React conventions
import { useFlowStore } from "@/lib/store";

type HandleCategory = "number" | "color";

interface FlowHandleProps extends Omit<HandleProps, "className"> {
  category: HandleCategory;
  className?: string;
}

const FlowHandle = ({
  category,
  id,
  type,
  className = "",
  ...props
}: FlowHandleProps) => {
  const edges = useFlowStore((state) => state.edges);
  const nodeId = useNodeId();

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: edge connection logic requires multiple checks
  const isConnected = useMemo(() => {
    if (!nodeId) {
      return false;
    }

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: this is a complex logic to check if the handle is connected
    return edges.some((edge) => {
      // biome-ignore lint/suspicious/noExplicitAny: edge properties may not be fully typed
      const edgeSource = (edge as any).source;
      // biome-ignore lint/suspicious/noExplicitAny: edge properties may not be fully typed
      const edgeTarget = (edge as any).target;
      // biome-ignore lint/suspicious/noExplicitAny: edge properties may not be fully typed
      const edgeSourceHandle = (edge as any).sourceHandle;
      // biome-ignore lint/suspicious/noExplicitAny: edge properties may not be fully typed
      const edgeTargetHandle = (edge as any).targetHandle;

      if (type === "source") {
        // For source handles: check if edge starts from this node
        if (edgeSource !== nodeId) {
          return false;
        }
        // If handle has id, check for exact match; if no id, check if sourceHandle is also null/undefined
        if (id) {
          return edgeSourceHandle === id || edgeSourceHandle === String(id);
        }
        return !edgeSourceHandle || edgeSourceHandle === null;
      }
      // For target handles: check if edge ends at this node
      if (edgeTarget !== nodeId) {
        return false;
      }
      // If handle has id, check for exact match; if no id, check if targetHandle is also null/undefined
      if (id) {
        return edgeTargetHandle === id || edgeTargetHandle === String(id);
      }
      return !edgeTargetHandle || edgeTargetHandle === null;
    });
  }, [edges, nodeId, id, type]);

  const colorClass =
    category === "number"
      ? "[--handle-color:orange!important]"
      : "[--handle-color:teal!important]";

  const connectedClass = isConnected ? "react-flow__handle-connected" : "";

  const combinedClassName =
    `${colorClass} ${connectedClass} ${className}`.trim();

  return (
    <Handle className={combinedClassName} id={id} type={type} {...props} />
  );
};

export default FlowHandle;
