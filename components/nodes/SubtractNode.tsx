"use client";

import { Handle, Position, NodeProps } from "reactflow";
import { Card, CardContent } from "@/components/ui/card";

interface SubtractNodeProps extends NodeProps {
  data: Record<string, never>;
}

const SubtractNode = ({ id, selected }: SubtractNodeProps) => {
  return (
    <Card className={`min-w-[200px] ${selected ? "ring-2 ring-primary" : ""}`}>
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="text-sm font-semibold">Subtract</div>
          <div className="text-xs text-muted-foreground">
            Subtract second number from first
          </div>
        </div>
        <div className="space-y-2 relative min-h-[100px]">
          <div className="relative" style={{ height: "60px" }}>
            <Handle
              type="target"
              position={Position.Left}
              id="input-0"
              className="w-5 h-5 !bg-primary"
              style={{ top: "20px" }}
            />
            <span className="absolute left-8 top-4 text-xs text-muted-foreground">Number</span>
          </div>
          <div className="relative" style={{ height: "60px" }}>
            <Handle
              type="target"
              position={Position.Left}
              id="input-1"
              className="w-5 h-5 !bg-primary"
              style={{ top: "20px" }}
            />
            <span className="absolute left-8 top-4 text-xs text-muted-foreground">Number</span>
          </div>
        </div>
        <Handle type="source" position={Position.Right} className="w-5 h-5 !bg-primary" />
      </CardContent>
    </Card>
  );
};

export default SubtractNode;

