"use client";

import { Handle, HandleProps, useNodeId } from "@xyflow/react";
import { useMemo } from "react";
import { useFlowContext } from "./FlowContext";

type HandleCategory = "number" | "color";

interface FlowHandleProps extends Omit<HandleProps, "className"> {
  category: HandleCategory;
  className?: string;
}

const FlowHandle = ({ category, id, type, className = "", ...props }: FlowHandleProps) => {
  const { edges } = useFlowContext();
  const nodeId = useNodeId();
  
  const isConnected = useMemo(() => {
    if (!nodeId) return false;
    
    return edges.some((edge) => {
      const edgeSource = (edge as any).source;
      const edgeTarget = (edge as any).target;
      const edgeSourceHandle = (edge as any).sourceHandle;
      const edgeTargetHandle = (edge as any).targetHandle;
      
      if (type === "source") {
        // For source handles: check if edge starts from this node
        if (edgeSource !== nodeId) return false;
        // If handle has id, check for exact match; if no id, check if sourceHandle is also null/undefined
        if (id) {
          return edgeSourceHandle === id || edgeSourceHandle === String(id);
        } else {
          return !edgeSourceHandle || edgeSourceHandle === null;
        }
      } else {
        // For target handles: check if edge ends at this node
        if (edgeTarget !== nodeId) return false;
        // If handle has id, check for exact match; if no id, check if targetHandle is also null/undefined
        if (id) {
          return edgeTargetHandle === id || edgeTargetHandle === String(id);
        } else {
          return !edgeTargetHandle || edgeTargetHandle === null;
        }
      }
    });
  }, [edges, nodeId, id, type]);

  const colorClass = category === "number" 
    ? "[--handle-color:orange!important]" 
    : "[--handle-color:teal!important]";
  
  const connectedClass = isConnected ? "react-flow__handle-connected" : "";
  
  const combinedClassName = `${colorClass} ${connectedClass} ${className}`.trim();

  return (
    <Handle
      id={id}
      type={type}
      className={combinedClassName}
      {...props}
    />
  );
};

export default FlowHandle;

