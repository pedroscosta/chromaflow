"use client";

import {
  Blend,
  Download,
  Droplet,
  Hash,
  Palette,
  Plus,
  RotateCw,
  Sun,
  X,
} from "lucide-react";
import { useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { NodeType } from "@/lib/types";

interface SidebarProps {
  onDragStart: (event: React.DragEvent, nodeType: NodeType) => void;
}

const Sidebar = ({ onDragStart }: SidebarProps) => {
  const handleDragStart = useCallback(
    (e: React.DragEvent, nodeType: NodeType) => {
      onDragStart(e, nodeType);
    },
    [onDragStart]
  );

  const nodeTypes: Array<{
    type: NodeType;
    label: string;
    icon: React.ReactNode;
    category?: string;
  }> = [
    {
      type: "inputColor",
      label: "Color Input",
      icon: <Palette className="h-3.5 w-3.5" />,
      category: "Inputs",
    },
    {
      type: "inputNumber",
      label: "Number Input",
      icon: <Hash className="h-3.5 w-3.5" />,
      category: "Inputs",
    },
    {
      type: "lighten",
      label: "Lighten",
      icon: <Sun className="h-3.5 w-3.5" />,
      category: "Color Operations",
    },
    {
      type: "saturate",
      label: "Saturate",
      icon: <Droplet className="h-3.5 w-3.5" />,
      category: "Color Operations",
    },
    {
      type: "rotate",
      label: "Rotate",
      icon: <RotateCw className="h-3.5 w-3.5" />,
      category: "Color Operations",
    },
    {
      type: "mix",
      label: "Mix",
      icon: <Blend className="h-3.5 w-3.5" />,
      category: "Color Operations",
    },
    {
      type: "add",
      label: "Add",
      icon: <Plus className="h-3.5 w-3.5" />,
      category: "Number Operations",
    },
    {
      type: "multiply",
      label: "Multiply",
      icon: <X className="h-3.5 w-3.5" />,
      category: "Number Operations",
    },
    {
      type: "output",
      label: "Output",
      icon: <Download className="h-3.5 w-3.5" />,
      category: "Output",
    },
  ];

  const groupedNodes = nodeTypes.reduce(
    (acc, node) => {
      const category = node.category || "Other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(node);
      return acc;
    },
    {} as Record<string, typeof nodeTypes>
  );

  return (
    <div className="h-full w-48 shrink-0 space-y-3 overflow-y-auto border-border border-r bg-card p-3">
      {/* <h2 className="text-xs font-semibold mb-2">Nodes</h2> */}
      {Object.entries(groupedNodes).map(([category, nodes]) => (
        <div className="space-y-2" key={category}>
          <h3 className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
            {category}
          </h3>
          {nodes.map(({ type, label, icon }) => (
            <Card
              className="cursor-grab p-0 transition-colors hover:bg-accent active:cursor-grabbing"
              draggable
              key={type}
              onDragStart={(e) => handleDragStart(e, type)}
            >
              <CardContent className="flex items-center gap-1.5 p-2">
                {icon}
                <span className="text-xs">{label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
