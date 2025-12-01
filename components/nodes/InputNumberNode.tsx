"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputNumberData } from "@/lib/types";
import { useCallback } from "react";
import { NodeProps, Position } from "reactflow";
import { useFlowContext } from "../FlowContext";
import FlowHandle from "../FlowHandle";

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
    <Card className={`min-w-[200px] p-0 ${selected ? "ring-2 ring-primary" : ""}`}>
      <CardContent className="py-4 px-0 space-y-3">
        <div className="space-y-2 px-4">
          <div className="text-xs font-semibold">
            Number input
          </div>
          <Input
            id={`name-${id}`}
            value={name}
            onChange={handleNameChange}
            placeholder="number-name"
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-2 px-4">
            <Label htmlFor={`value-${id}`} className="text-xs font-semibold">
              Value
            </Label>
          <div className="relative">
            <Input
              id={`value-${id}`}
              type="number"
              value={value}
              onChange={handleValueChange}
              placeholder="0"
              className="h-8 text-sm"
              step="any"
            />
            <FlowHandle type="source" position={Position.Right} category="number" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InputNumberNode;

