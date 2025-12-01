"use client";

import { Position, NodeProps } from "reactflow";
import { Card, CardContent } from "@/components/ui/card";
import FlowHandle from "../FlowHandle";

interface MixNodeProps extends NodeProps {
  data: Record<string, never>;
}

const MixNode = ({ id, selected }: MixNodeProps) => {
  return (
    <Card className={`min-w-[200px] ${selected ? "ring-2 ring-primary" : ""}`}>
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="text-sm font-semibold">Mix</div>
          <div className="text-xs text-muted-foreground">
            Mix two colors together
          </div>
        </div>
        <div className="space-y-2 relative min-h-[100px]">
          <div className="relative" style={{ height: "60px" }}>
            <FlowHandle
              type="target"
              position={Position.Left}
              id="input-0"
              category="color"
              className="w-5 h-5"
              style={{ top: "20px" }}
            />
            <span className="absolute left-8 top-4 text-xs text-muted-foreground">Color 1</span>
          </div>
          <div className="relative" style={{ height: "60px" }}>
            <FlowHandle
              type="target"
              position={Position.Left}
              id="input-1"
              category="color"
              className="w-5 h-5"
              style={{ top: "20px" }}
            />
            <span className="absolute left-8 top-4 text-xs text-muted-foreground">Color 2</span>
          </div>
        </div>
        <FlowHandle type="source" position={Position.Right} category="color" />
      </CardContent>
    </Card>
  );
};

export default MixNode;

