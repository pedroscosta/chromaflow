"use client";

import { Card, CardContent } from "@/components/ui/card";
import { KebabCaseInput } from "@/components/ui/kebab-case-input";
import { OutputData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { NodeProps, Position } from "@xyflow/react";
import { useCallback } from "react";
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
    <Card className={cn("min-w-[200px] p-0", selected && "ring-2 ring-primary")}>
      <CardContent className="py-4 px-4 space-y-3 text-left">
        <div className="space-y-2">
          <div className="text-xs font-semibold">Output</div>
          <div className="relative">
          <KebabCaseInput
            id={`name-${id}`}
            value={name}
            onChange={handleNameChange}
            placeholder="output-name"
            className="h-8 text-sm"
          />
              <FlowHandle type="target" position={Position.Left} category="color" />
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OutputNode;

