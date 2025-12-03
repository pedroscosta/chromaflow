"use client";

import { type NodeProps, Position } from "@xyflow/react";
import { ArrowDownUp } from "lucide-react";
import { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { computeNodeOutput } from "@/lib/node-compute";
import { useFlowStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import FlowHandle from "../FlowHandle";

interface AddNodeProps extends NodeProps {
  data: Record<string, never> & { isSubtract?: boolean };
}

const AddNode = ({ id, selected, type, data }: AddNodeProps) => {
  const updateNodeData = useFlowStore((state) => state.updateNodeData);
  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);

  // Initialize mode based on node type or existing data
  const isSubtract = useMemo(() => {
    if (data.isSubtract !== undefined) {
      return data.isSubtract;
    }
    // If no data, initialize based on node type
    return type === "subtract";
  }, [data.isSubtract, type]);

  const handleInvert = useCallback(() => {
    updateNodeData(id, { isSubtract: !isSubtract });
  }, [id, isSubtract, updateNodeData]);

  const modeLabel = isSubtract ? "Subtract" : "Add";
  const tooltipText = isSubtract ? "Switch to Add" : "Switch to Subtract";

  const outputValue = useMemo(() => {
    const currentNode = nodes.find((n) => n.id === id);
    if (!currentNode) return null;
    return computeNodeOutput(currentNode, nodes, edges);
  }, [id, nodes, edges]);

  const outputNumber = typeof outputValue === "number" ? outputValue : null;

  return (
    <TooltipProvider>
      <Card
        className={cn("min-w-[200px] p-0", selected && "ring-2 ring-primary")}
      >
        <CardContent className="flex flex-col gap-3 p-0 pt-4">
          <div className="space-y-2 px-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-sm">{modeLabel}</div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    aria-label={tooltipText}
                    className="h-6 w-6"
                    onClick={handleInvert}
                    size="icon-sm"
                    variant="ghost"
                  >
                    <ArrowDownUp />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltipText}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="grid grid-cols-2 border-t">
            <div className="space-y-2 border-r px-4 py-2">
              <div className="relative">
                <FlowHandle
                  category="number"
                  id="input-0"
                  position={Position.Left}
                  type="target"
                />
                Number
              </div>
              <div className="relative">
                <FlowHandle
                  category="number"
                  id="input-1"
                  position={Position.Left}
                  type="target"
                />
                Number
              </div>
            </div>
            <div className="relative space-y-2 bg-background/50 px-4 py-2">
              <div className="relative">
                <FlowHandle
                  category="number"
                  position={Position.Right}
                  type="source"
                />
                Output
              </div>
            </div>
          </div>
          {outputNumber !== null && (
            <div className="border-t px-4 py-2">
              <div className="font-mono text-muted-foreground text-sm">
                {outputNumber}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default AddNode;
