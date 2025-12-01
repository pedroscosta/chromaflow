"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputColorData } from "@/lib/types";
import Color from "colorjs.io";
import { useCallback } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { useFlowContext } from "../FlowContext";

interface InputColorNodeProps extends NodeProps {
  data: InputColorData;
}

const InputColorNode = ({ data, id, selected }: InputColorNodeProps) => {
  const { updateNodeData } = useFlowContext();
  const color = data.color || "oklch(0.5 0.2 180)";
  const name = data.name || "";

  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newColor = e.target.value;
      updateNodeData(id, { color: newColor });
    },
    [id, updateNodeData]
  );

  const convertToKebabCase = useCallback((value: string) => {
    return value
      .toLowerCase()
      .replace(/[ _]+/g, "-")
  }, []);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const kebabCaseValue = convertToKebabCase(e.target.value);
      updateNodeData(id, { name: kebabCaseValue });
    },
    [id, updateNodeData, convertToKebabCase]
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

  const handleHexColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const hex = e.target.value;
        const c = new Color(hex);
        const oklch = c.to("oklch").toString({ format: "oklch" });
        updateNodeData(id, { color: oklch });
      } catch {
        // Invalid color, ignore
      }
    },
    [id, updateNodeData]
  );

  return (
    <Card className={`min-w-[200px] p-0 ${selected ? "ring-2 ring-primary" : ""}`}>
      <CardContent className="py-4 px-0 space-y-3">
        <div className="space-y-2 px-4">
          <div className="text-xs font-semibold">
            Color input
          </div>
          <Input
            id={`name-${id}`}
            value={name}
            onChange={handleNameChange}
            placeholder="color-name"
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-2 px-4">
          <Label htmlFor={`color-${id}`} className="text-xs font-semibold">
            Color
          </Label>
          <div className="relative flex gap-2">
            <Input
              id={`color-${id}`}
              type="color"
              value={getHexColor()}
              onChange={handleHexColorChange}
              className="h-8 w-16 p-1 cursor-pointer"
            />
            <Input
              value={color}
              onChange={handleColorChange}
              placeholder="oklch(0.5 0.2 180)"
              className="h-8 text-xs font-mono flex-1"
            />
            <Handle type="source" position={Position.Right} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InputColorNode;

