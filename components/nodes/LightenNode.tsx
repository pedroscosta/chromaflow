"use client";

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
import { cn, formatOklch } from "@/lib/utils";
import { type NodeProps, Position } from "@xyflow/react";
import Color from "colorjs.io";
import { ArrowDownUp } from "lucide-react";
import { useCallback, useMemo } from "react";
import FlowHandle from "../FlowHandle";

interface LightenNodeProps extends NodeProps {
  data: Record<string, never> & { isDarken?: boolean };
}

const LightenNode = ({ id, selected, type, data }: LightenNodeProps) => {
  const updateNodeData = useFlowStore((state) => state.updateNodeData);
  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);

  // Initialize mode based on node type or existing data
  const isDarken = useMemo(() => {
    if (data.isDarken !== undefined) {
      return data.isDarken;
    }
    // If no data, initialize based on node type
    return type === "darken";
  }, [data.isDarken, type]);

  const handleInvert = useCallback(() => {
    updateNodeData(id, { isDarken: !isDarken });
  }, [id, isDarken, updateNodeData]);

  const modeLabel = isDarken ? "Darken" : "Lighten";
  const tooltipText = isDarken ? "Switch to Lighten" : "Switch to Darken";

  const outputValue = useMemo(() => {
    const currentNode = nodes.find((n) => n.id === id);
    if (!currentNode) {
      return null;
    }
    return computeNodeOutput(currentNode, nodes, edges);
  }, [id, nodes, edges]);

  const outputColor = useMemo(() => {
    if (typeof outputValue !== "string") {
      return null;
    }
    try {
      const color = new Color(outputValue);
      return color.to("srgb").toString({ format: "hex" });
    } catch {
      return null;
    }
  }, [outputValue]);

  const outputOklch =
    typeof outputValue === "string" ? formatOklch(outputValue) : null;

  return (
    <TooltipProvider>
      <Card
        className={cn(
          "min-w-[200px] p-0",
          selected ? "ring-2 ring-primary" : ""
        )}
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
                  category="color"
                  id="input-0"
                  position={Position.Left}
                  type="target"
                />
                Color
              </div>
              <div className="relative">
                <FlowHandle
                  category="number"
                  id="input-1"
                  position={Position.Left}
                  type="target"
                />
                Amount
              </div>
            </div>
            <div className="relative space-y-2 bg-background/50 px-4 py-2">
              <div className="relative">
                <FlowHandle
                  category="color"
                  position={Position.Right}
                  type="source"
                />
                Output
              </div>
            </div>
          </div>
          {outputOklch && (
            <div className="border-t px-4 py-2">
              <div className="flex items-center gap-2">
                {outputColor && (
                  <div
                    className="size-6 shrink-0 rounded border"
                    style={{ backgroundColor: outputColor }}
                  />
                )}
                <code className="font-mono text-muted-foreground text-xs">
                  {outputOklch}
                </code>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default LightenNode;
