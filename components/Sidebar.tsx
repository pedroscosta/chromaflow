"use client";

import { useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { NodeType } from "@/lib/types";
import {
  Palette,
  Hash,
  Download,
  Sun,
  Moon,
  Droplet,
  Droplets,
  RotateCw,
  Blend,
  Plus,
  Minus,
  X,
  Divide,
} from "lucide-react";

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

  const nodeTypes: Array<{ type: NodeType; label: string; icon: React.ReactNode; category?: string }> = [
    {
      type: "inputColor",
      label: "Color Input",
      icon: <Palette className="w-4 h-4" />,
      category: "Inputs",
    },
    {
      type: "inputNumber",
      label: "Number Input",
      icon: <Hash className="w-4 h-4" />,
      category: "Inputs",
    },
    {
      type: "lighten",
      label: "Lighten",
      icon: <Sun className="w-4 h-4" />,
      category: "Color Operations",
    },
    {
      type: "darken",
      label: "Darken",
      icon: <Moon className="w-4 h-4" />,
      category: "Color Operations",
    },
    {
      type: "saturate",
      label: "Saturate",
      icon: <Droplet className="w-4 h-4" />,
      category: "Color Operations",
    },
    {
      type: "desaturate",
      label: "Desaturate",
      icon: <Droplets className="w-4 h-4" />,
      category: "Color Operations",
    },
    {
      type: "rotate",
      label: "Rotate",
      icon: <RotateCw className="w-4 h-4" />,
      category: "Color Operations",
    },
    {
      type: "mix",
      label: "Mix",
      icon: <Blend className="w-4 h-4" />,
      category: "Color Operations",
    },
    {
      type: "add",
      label: "Add",
      icon: <Plus className="w-4 h-4" />,
      category: "Number Operations",
    },
    {
      type: "subtract",
      label: "Subtract",
      icon: <Minus className="w-4 h-4" />,
      category: "Number Operations",
    },
    {
      type: "multiply",
      label: "Multiply",
      icon: <X className="w-4 h-4" />,
      category: "Number Operations",
    },
    {
      type: "divide",
      label: "Divide",
      icon: <Divide className="w-4 h-4" />,
      category: "Number Operations",
    },
    {
      type: "output",
      label: "Output",
      icon: <Download className="w-4 h-4" />,
      category: "Output",
    },
  ];

  const groupedNodes = nodeTypes.reduce((acc, node) => {
    const category = node.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(node);
    return acc;
  }, {} as Record<string, typeof nodeTypes>);

  return (
    <div className="w-64 h-full bg-card border-r border-border p-4 space-y-4 overflow-y-auto">
      <h2 className="text-sm font-semibold mb-4">Nodes</h2>
      {Object.entries(groupedNodes).map(([category, nodes]) => (
        <div key={category} className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {category}
          </h3>
          {nodes.map(({ type, label, icon }) => (
            <Card
              key={type}
              draggable
              onDragStart={(e) => handleDragStart(e, type)}
              className="cursor-grab active:cursor-grabbing hover:bg-accent transition-colors"
            >
              <CardContent className="p-3 flex items-center gap-2">
                {icon}
                <span className="text-sm">{label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;

