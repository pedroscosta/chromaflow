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
import { CustomEdge, CustomNode, NodeType } from "@/lib/types";
import { Check, Code2, Copy, Download, Heart, Upload } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useRef } from "react";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);
  const isExportDialogOpen = useFlowStore((state) => state.isExportDialogOpen);
  const copied = useFlowStore((state) => state.copied);
  const setIsExportDialogOpen = useFlowStore((state) => state.setIsExportDialogOpen);
  const setCopied = useFlowStore((state) => state.setCopied);
  const importState = useFlowStore((state) => state.importState);

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

  const handleExportJSON = useCallback(() => {
    const data = {
      nodes,
      edges,
      version: "1.0.0",
      exportedAt: new Date().toISOString(),
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `flow-export-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const handleImportJSON = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const data = JSON.parse(text) as {
            nodes?: CustomNode[];
            edges?: CustomEdge[];
            version?: string;
          };

          if (data.nodes && data.edges) {
            importState(data.nodes, data.edges);
          } else {
            alert("Invalid file format. The file must contain nodes and edges.");
          }
        } catch (error) {
          alert("Failed to parse JSON file. Please check the file format.");
          console.error("Import error:", error);
        }
      };
      reader.readAsText(file);

      // Reset input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [importState]
  );

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
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-semibold">chromaflow</h1>
          <span
            className="text-sm text-muted-foreground"
            aria-label="made with love by @pedroscosta on Twitter"
          >
            made with <Heart className="inline-block size-4 -mt-0.5" /> by{" "}
            <Link href="https://x.com/pedroscosta_" target="_blank" className="font-medium underline hover:text-primary transition-colors">@pedroscosta</Link>
          </span>
          <Link href="https://github.com/pedroscosta/chromaflow" target="_blank" className="text-sm text-muted-foreground underline hover:text-primary transition-colors">GitHub</Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0 border rounded-md overflow-hidden">
            <Button
              onClick={handleExportJSON}
              variant="outline"
              size="default"
              className="rounded-r-none"
            >
              <Download className="size-4" />
              Export
            </Button>
            <Button
              onClick={handleImportJSON}
              variant="outline"
              size="default"
              className="rounded-l-none border-l-0"
            >
              <Upload className="size-4" />
            </Button>
          </div>
          <Button onClick={handleExportClick} variant="default" size="default">
            <Code2 className="size-4" />
            Export CSS
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Import JSON file"
          />
        </div>
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
