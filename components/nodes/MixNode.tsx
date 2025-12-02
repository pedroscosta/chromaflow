"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type NodeProps, Position } from "@xyflow/react";
import FlowHandle from "../FlowHandle";

interface MixNodeProps extends NodeProps {
  data: Record<string, never>;
}

const MixNode = ({ selected }: MixNodeProps) => (
  <Card className={cn("min-w-[200px] p-0", selected && "ring-2 ring-primary")}>
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
    </CardContent>
  </Card>
);

export default MixNode;
