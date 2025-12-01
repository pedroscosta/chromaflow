"use client";

import { useCallback } from "react";
import { Position, NodeProps } from "reactflow";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { OutputData } from "@/lib/types";
import { useFlowContext } from "../FlowContext";
import FlowHandle from "../FlowHandle";

interface OutputNodeProps extends NodeProps {
  data: OutputData;
}

const OutputNode = ({ data, id, selected }: OutputNodeProps) => {
  const { updateNodeData } = useFlowContext();
  const name = data.name || "";

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { name: e.target.value });
    },
    [id, updateNodeData]
  );

  return (
    <Card className={`min-w-[200px] ${selected ? "ring-2 ring-primary" : ""}`}>
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <Label htmlFor={`name-${id}`} className="text-xs font-semibold">
            Output Name
          </Label>
          <Input
            id={`name-${id}`}
            value={name}
            onChange={handleNameChange}
            placeholder="output-name"
            className="h-8 text-sm"
          />
        </div>
        <div className="text-xs text-muted-foreground">
          Outputs the connected value as a CSS variable
        </div>
        <FlowHandle type="target" position={Position.Left} category="color" className="w-5 h-5" />
      </CardContent>
    </Card>
  );
};

export default OutputNode;

