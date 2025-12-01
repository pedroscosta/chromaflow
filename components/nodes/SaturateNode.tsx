"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { NodeProps, Position } from "@xyflow/react";
import { ArrowDownUp } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useFlowContext } from "../FlowContext";
import FlowHandle from "../FlowHandle";

interface SaturateNodeProps extends NodeProps {
  data: Record<string, never> & { isDesaturate?: boolean };
}

const SaturateNode = ({ id, selected, type, data }: SaturateNodeProps) => {
  const { updateNodeData } = useFlowContext();
  
  // Initialize mode based on node type or existing data
  const isDesaturate = useMemo(() => {
    if (data.isDesaturate !== undefined) {
      return data.isDesaturate;
    }
    // If no data, initialize based on node type
    return type === "desaturate";
  }, [data.isDesaturate, type]);

  const handleInvert = useCallback(() => {
    updateNodeData(id, { isDesaturate: !isDesaturate });
  }, [id, isDesaturate, updateNodeData]);

  const modeLabel = isDesaturate ? "Desaturate" : "Saturate";
  const tooltipText = isDesaturate ? "Switch to Saturate" : "Switch to Desaturate";

  return (
    <TooltipProvider>
      <Card className={cn("min-w-[200px] p-0", selected && "ring-2 ring-primary")}>
        <CardContent className="p-0 pt-4 flex flex-col gap-3">
          <div className="space-y-2 px-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">{modeLabel}</div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleInvert}
                    className="h-6 w-6"
                    aria-label={tooltipText}
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
            <div className="space-y-2 border-r py-2 px-4">
              <div className="relative">
                <FlowHandle
                  type="target"
                  position={Position.Left}
                  id="input-0"
                  category="color"
                />
                Color
              </div>
              <div className="relative">
                <FlowHandle
                  type="target"
                  position={Position.Left}
                  id="input-1"
                  category="number"
                />
                Amount
              </div>
            </div>
            <div className="space-y-2 bg-background/50 relative px-4 py-2">
              <div className="relative">
                <FlowHandle
                  type="source"
                  position={Position.Right}
                  category="color"
                />
                Output
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default SaturateNode;

