"use client";

import { useCallback } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { InputNumberData } from "@/lib/types";
import { useFlowContext } from "../FlowContext";

interface InputNumberNodeProps extends NodeProps {
  data: InputNumberData;
}

const InputNumberNode = ({ data, id, selected }: InputNumberNodeProps) => {
  const { updateNodeData } = useFlowContext();
  const value = data.value?.toString() || "0";
  const name = data.name || "";

  const handleValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const numValue = parseFloat(e.target.value) || 0;
      updateNodeData(id, { value: numValue });
    },
    [id, updateNodeData]
  );

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
            Name
          </Label>
          <Input
            id={`name-${id}`}
            value={name}
            onChange={handleNameChange}
            placeholder="number-name"
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`value-${id}`} className="text-xs font-semibold">
            Value
          </Label>
          <Input
            id={`value-${id}`}
            type="number"
            value={value}
            onChange={handleValueChange}
            placeholder="0"
            className="h-8 text-sm"
            step="any"
          />
        </div>
        <Handle type="source" position={Position.Right} className="w-5 h-5 !bg-primary" />
      </CardContent>
    </Card>
  );
};

export default InputNumberNode;

