"use client";

import { type NodeProps, Position } from "@xyflow/react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import FlowHandle from "../FlowHandle";

interface RotateNodeProps extends NodeProps {
  data: Record<string, never>;
}

const RotateNode = ({ id, selected }: RotateNodeProps) => (
  <Card className={cn("min-w-[200px] p-0", selected && "ring-2 ring-primary")}>
    <CardContent className="flex flex-col gap-3 p-0 pt-4">
      <div className="space-y-2 px-4">
        <div className="font-semibold text-sm">Rotate</div>
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
            Degrees
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

export default RotateNode;
