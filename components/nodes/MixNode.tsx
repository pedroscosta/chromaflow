"use client";

import { type NodeProps, Position } from "@xyflow/react";
import Color from "colorjs.io";
import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { computeNodeOutput } from "@/lib/node-compute";
import { useFlowStore } from "@/lib/store";
import { cn, formatOklch } from "@/lib/utils";
import FlowHandle from "../FlowHandle";

interface MixNodeProps extends NodeProps {
  data: Record<string, never>;
}

const MixNode = ({ id, selected }: MixNodeProps) => {
  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);

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
    <Card
      className={cn("min-w-[200px] p-0", selected && "ring-2 ring-primary")}
    >
      <CardContent className="flex flex-col gap-3 p-0 pt-4">
        <div className="space-y-2 px-4">
          <div className="font-semibold text-sm">Mix</div>
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
              Color 1
            </div>
            <div className="relative">
              <FlowHandle
                category="color"
                id="input-1"
                position={Position.Left}
                type="target"
              />
              Color 2
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
  );
};

export default MixNode;
