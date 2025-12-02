"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { KebabCaseInput } from "@/components/ui/kebab-case-input";
import { Label } from "@/components/ui/label";
import { useFlowStore } from "@/lib/store";
import { InputColorData } from "@/lib/types";
import { NodeProps, Position } from "@xyflow/react";
import Color from "colorjs.io";
import { useCallback } from "react";
import FlowHandle from "../FlowHandle";
import { Button } from "../ui/button";
import { ColorPicker } from "../ui/color-picker";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface InputColorNodeProps extends NodeProps {
  data: InputColorData;
}

const InputColorNode = ({ data, id, selected }: InputColorNodeProps) => {
  const updateNodeData = useFlowStore((state) => state.updateNodeData);
  const color = data.color || "oklch(0.5 0.2 180)";
  const name = data.name || "";

  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newColor = e.target.value;
      updateNodeData(id, { color: newColor });
    },
    [id, updateNodeData]
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { name: e.target.value });
    },
    [id, updateNodeData]
  );

  // Convert OKLCH to hex for color input
  const getHexColor = useCallback(() => {
    try {
      const c = new Color(color);
      return c.to("srgb").toString({ format: "hex" });
    } catch {
      return "#808080";
    }
  }, [color]);

  return (
    <Card className={`min-w-[200px] p-0 ${selected ? "ring-2 ring-primary" : ""}`}>
      <CardContent className="py-4 px-4 space-y-3">
        <div className="space-y-2">
          <div className="text-xs font-semibold">
            Color input
          </div>
          <KebabCaseInput
            id={`name-${id}`}
            value={name}
            onChange={handleNameChange}
            placeholder="color-name"
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`color-${id}`} className="text-xs font-semibold">
            Color
          </Label>
          <div className="relative flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="size-8" style={{ background: getHexColor() }} />
              </PopoverTrigger>
              <PopoverContent className="w-auto">
                <ColorPicker onChange={(newColor) => updateNodeData(id, { color: newColor })} value={color} />
              </PopoverContent>
            </Popover>
            <Input
              value={color}
              onChange={handleColorChange}
              placeholder="oklch(0.5 0.2 180)"
              className="h-8 text-xs font-mono flex-1"
            />
            <FlowHandle type="source" position={Position.Right} category="color" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InputColorNode;

