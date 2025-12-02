"use client";

import { type NodeProps, Position } from "@xyflow/react";
import Color from "colorjs.io";
import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { KebabCaseInput } from "@/components/ui/kebab-case-input";
import { Label } from "@/components/ui/label";
import { useFlowStore } from "@/lib/store";
import type { InputColorData } from "@/lib/types";
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
  const [localColor, setLocalColor] = useState(color);

  const debouncedUpdateColor = useDebouncedCallback((newColor: string) => {
    updateNodeData(id, { color: newColor });
  }, 300);

  // Sync local color when prop changes externally
  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newColor = e.target.value;
      setLocalColor(newColor);
      debouncedUpdateColor(newColor);
    },
    [debouncedUpdateColor]
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
      const c = new Color(localColor);
      return c.to("srgb").toString({ format: "hex" });
    } catch {
      return "#808080";
    }
  }, [localColor]);

  return (
    <Card
      className={`min-w-[200px] p-0 ${selected ? "ring-2 ring-primary" : ""}`}
    >
      <CardContent className="space-y-3 px-4 py-4">
        <div className="space-y-2">
          <div className="font-semibold text-xs">Color input</div>
          <KebabCaseInput
            className="h-8 text-sm"
            id={`name-${id}`}
            onChange={handleNameChange}
            placeholder="color-name"
            value={name}
          />
        </div>
        <div className="space-y-2">
          <Label className="font-semibold text-xs" htmlFor={`color-${id}`}>
            Color
          </Label>
          <div className="relative flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="size-8"
                  size="icon"
                  style={{ background: getHexColor() }}
                  variant="outline"
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto">
                <ColorPicker
                  onChange={(newColor) => {
                    setLocalColor(newColor);
                    updateNodeData(id, { color: newColor });
                  }}
                  value={localColor}
                />
              </PopoverContent>
            </Popover>
            <Input
              className="h-8 flex-1 font-mono text-xs"
              onChange={handleColorChange}
              placeholder="oklch(0.5 0.2 180)"
              value={localColor}
            />
            <FlowHandle
              category="color"
              position={Position.Right}
              type="source"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InputColorNode;
