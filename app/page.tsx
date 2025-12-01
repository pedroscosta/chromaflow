"use client";

import FlowEditor from "@/components/FlowEditor";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { generateCSSVariables } from "@/lib/css-generator";
import { useFlowStore } from "@/lib/store";
import { NodeType } from "@/lib/types";
import { Check, Copy, Download } from "lucide-react";
import { useCallback, useMemo } from "react";

export default function Home() {
  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);
  const isExportDialogOpen = useFlowStore((state) => state.isExportDialogOpen);
  const copied = useFlowStore((state) => state.copied);
  const setIsExportDialogOpen = useFlowStore((state) => state.setIsExportDialogOpen);
  const setCopied = useFlowStore((state) => state.setCopied);

  const handleDragStart = useCallback((event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  }, []);

  const handleExportClick = useCallback(() => {
    setIsExportDialogOpen(true);
  }, [setIsExportDialogOpen]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cssExport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cssVariables = generateCSSVariables(nodes, edges);
  const cssExport = useMemo(() => {
    if (cssVariables.length === 0) {
      return ":root {\n  /* Add nodes to generate CSS variables */\n}";
    }
    return `:root {\n${cssVariables.map((v) => `  ${v.name}: ${v.value};`).join("\n")}\n}`;
  }, [cssVariables]);

  return (
    <div className="flex flex-col h-screen w-full bg-background">
      <nav className="w-full border-b bg-sidebar px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Parametric Palette Editor</h1>
        <Button onClick={handleExportClick} variant="default" size="default">
          <Download className="size-4" />
          Export
        </Button>
      </nav>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onDragStart={handleDragStart} />
        <div className="flex-1">
          <FlowEditor />
        </div>
      </div>
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Export CSS Variables</DialogTitle>
            <DialogDescription>
              Copy the CSS variables below to use in your project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <textarea
                readOnly
                value={cssExport}
                className="w-full h-64 p-4 bg-muted rounded-md border font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                onClick={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.select();
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                onClick={handleCopy}
                className="h-8"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
