"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { NodeProps, Position } from "@xyflow/react";
import FlowHandle from "../FlowHandle";

interface MixNodeProps extends NodeProps {
  data: Record<string, never>;
}

const MixNode = ({ id, selected }: MixNodeProps) => {
  return (
    <Card className={cn("min-w-[200px] p-0", selected && "ring-2 ring-primary")}>
      <CardContent className="p-0 pt-4 flex flex-col gap-3">
        <div className="space-y-2 px-4">
          <div className="text-sm font-semibold">Mix</div>
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
              Color 1
            </div>
            <div className="relative">
              <FlowHandle
                type="target"
                position={Position.Left}
                id="input-1"
                category="color"
              />
              Color 2
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
  );
};

export default MixNode;

