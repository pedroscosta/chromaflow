"use client";

import { type NodeProps, Position } from "@xyflow/react";
import { useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { KebabCaseInput } from "@/components/ui/kebab-case-input";
import { useFlowStore } from "@/lib/store";
import type { OutputData } from "@/lib/types";
import { cn } from "@/lib/utils";
import FlowHandle from "../FlowHandle";

interface OutputNodeProps extends NodeProps {
  data: OutputData;
}

const OutputNode = ({ data, id, selected }: OutputNodeProps) => {
  const updateNodeData = useFlowStore((state) => state.updateNodeData);
  const name = data.name || "";

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { name: e.target.value });
    },
    [id, updateNodeData]
  );

  return (
    <Card
      className={cn("min-w-[200px] p-0", selected && "ring-2 ring-primary")}
    >
      <CardContent className="space-y-3 px-4 py-4 text-left">
        <div className="space-y-2">
          <div className="font-semibold text-xs">Output</div>
          <div className="relative">
            <KebabCaseInput
              className="h-8 text-sm"
              id={`name-${id}`}
              onChange={handleNameChange}
              placeholder="output-name"
              value={name}
            />
            <FlowHandle
              category="color"
              position={Position.Left}
              type="target"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OutputNode;
