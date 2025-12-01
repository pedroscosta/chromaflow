"use client";

import { Card, CardContent } from "@/components/ui/card";
import { NodeType } from "@/lib/types";
import {
  Blend,
  Download,
  Droplet,
  Hash,
  Palette,
  Plus,
  RotateCw,
  Sun,
  X
} from "lucide-react";
import { useCallback } from "react";

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
      icon: <Palette className="w-3.5 h-3.5" />,
      category: "Inputs",
    },
    {
      type: "inputNumber",
      label: "Number Input",
      icon: <Hash className="w-3.5 h-3.5" />,
      category: "Inputs",
    },
    {
      type: "lighten",
      label: "Lighten",
      icon: <Sun className="w-3.5 h-3.5" />,
      category: "Color Operations",
    },
    {
      type: "saturate",
      label: "Saturate",
      icon: <Droplet className="w-3.5 h-3.5" />,
      category: "Color Operations",
    },
    {
      type: "rotate",
      label: "Rotate",
      icon: <RotateCw className="w-3.5 h-3.5" />,
      category: "Color Operations",
    },
    {
      type: "mix",
      label: "Mix",
      icon: <Blend className="w-3.5 h-3.5" />,
      category: "Color Operations",
    },
    {
      type: "add",
      label: "Add",
      icon: <Plus className="w-3.5 h-3.5" />,
      category: "Number Operations",
    },
    {
      type: "multiply",
      label: "Multiply",
      icon: <X className="w-3.5 h-3.5" />,
      category: "Number Operations",
    },
    {
      type: "output",
      label: "Output",
      icon: <Download className="w-3.5 h-3.5" />,
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
    <div className="w-48 h-full bg-card border-r border-border p-3 space-y-3 overflow-y-auto shrink-0">
      {/* <h2 className="text-xs font-semibold mb-2">Nodes</h2> */}
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
              className="cursor-grab active:cursor-grabbing hover:bg-accent transition-colors p-0"
            >
              <CardContent className="p-2 flex items-center gap-1.5">
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

