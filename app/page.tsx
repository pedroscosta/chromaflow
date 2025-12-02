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
import type { CustomEdge, CustomNode, NodeType } from "@/lib/types";
import { Check, Code2, Copy, Download, Heart, Upload } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useRef } from "react";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);
  const isExportDialogOpen = useFlowStore((state) => state.isExportDialogOpen);
  const copied = useFlowStore((state) => state.copied);
  const setIsExportDialogOpen = useFlowStore(
    (state) => state.setIsExportDialogOpen
  );
  const setCopied = useFlowStore((state) => state.setCopied);
  const importState = useFlowStore((state) => state.importState);

  const handleDragStart = useCallback(
    (event: React.DragEvent, nodeType: NodeType) => {
      event.dataTransfer.setData("application/reactflow", nodeType);
      event.dataTransfer.effectAllowed = "move";
    },
    []
  );

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
      if (!file) {
        return;
      }

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
            // biome-ignore lint/suspicious/noAlert: user feedback for invalid file format
            alert(
              "Invalid file format. The file must contain nodes and edges."
            );
          }
        } catch (error) {
          // biome-ignore lint/suspicious/noAlert: user feedback for parse errors
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
    <div className="flex h-screen w-full flex-col bg-background">
      <nav className="flex w-full items-center justify-between border-b bg-sidebar px-4 py-3">
        <div className="flex items-center gap-6">
          <h1 className="font-semibold text-lg">chromaflow</h1>
          <span className="text-muted-foreground text-sm">
            made with <Heart className="-mt-0.5 inline-block size-4" /> by{" "}
            <Link
              className="font-medium underline transition-colors hover:text-primary"
              href="https://x.com/pedroscosta_"
              target="_blank"
            >
              @pedroscosta
            </Link>
          </span>
          <Link
            className="text-muted-foreground text-sm underline transition-colors hover:text-primary"
            href="https://github.com/pedroscosta/chromaflow"
            target="_blank"
          >
            GitHub
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0 overflow-hidden rounded-md border">
            <Button
              className="rounded-r-none"
              onClick={handleExportJSON}
              size="default"
              variant="outline"
            >
              <Download className="size-4" />
              Export
            </Button>
            <Button
              className="rounded-l-none border-l-0"
              onClick={handleImportJSON}
              size="default"
              variant="outline"
            >
              <Upload className="size-4" />
            </Button>
          </div>
          <Button onClick={handleExportClick} size="default" variant="default">
            <Code2 className="size-4" />
            Export CSS
          </Button>
          <input
            accept=".json,application/json"
            aria-label="Import JSON file"
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
            type="file"
          />
        </div>
      </nav>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onDragStart={handleDragStart} />
        <div className="flex-1">
          <FlowEditor />
        </div>
      </div>
      <Dialog onOpenChange={setIsExportDialogOpen} open={isExportDialogOpen}>
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
                className="h-64 w-full resize-none rounded-md border bg-muted p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                onClick={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.select();
                }}
                readOnly
                value={cssExport}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button className="h-8" onClick={handleCopy} size="sm">
                {copied ? (
                  <>
                    <Check className="mr-1 h-3 w-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-3 w-3" />
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
