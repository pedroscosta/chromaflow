"use client";

import { type NodeProps, Position } from "@xyflow/react";
import { useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { KebabCaseInput } from "@/components/ui/kebab-case-input";
import { Label } from "@/components/ui/label";
import { useFlowStore } from "@/lib/store";
import type { InputNumberData } from "@/lib/types";
import FlowHandle from "../FlowHandle";

interface InputNumberNodeProps extends NodeProps {
  data: InputNumberData;
}

const InputNumberNode = ({ data, id, selected }: InputNumberNodeProps) => {
  const updateNodeData = useFlowStore((state) => state.updateNodeData);
  const value = data.value?.toString() || "0";
  const name = data.name || "";

  const handleValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const numValue = Number.parseFloat(e.target.value) || 0;
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
    <Card
      className={`min-w-[200px] p-0 ${selected ? "ring-2 ring-primary" : ""}`}
    >
      <CardContent className="space-y-3 px-0 py-4">
        <div className="space-y-2 px-4">
          <div className="font-semibold text-xs">Number input</div>
          <KebabCaseInput
            className="h-8 text-sm"
            id={`name-${id}`}
            onChange={handleNameChange}
            placeholder="number-name"
            value={name}
          />
        </div>
        <div className="space-y-2 px-4">
          <Label className="font-semibold text-xs" htmlFor={`value-${id}`}>
            Value
          </Label>
          <div className="relative">
            <Input
              className="h-8 text-sm"
              id={`value-${id}`}
              onChange={handleValueChange}
              placeholder="0"
              step="any"
              type="number"
              value={value}
            />
            <FlowHandle
              category="number"
              position={Position.Right}
              type="source"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InputNumberNode;
