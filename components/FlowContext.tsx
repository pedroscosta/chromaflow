"use client";

import { createContext, useContext, ReactNode } from "react";
import { CustomNode } from "@/lib/types";

interface FlowContextType {
  updateNodeData: (nodeId: string, newData: any) => void;
}

const FlowContext = createContext<FlowContextType | null>(null);

export const useFlowContext = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("useFlowContext must be used within FlowProvider");
  }
  return context;
};

interface FlowProviderProps {
  children: ReactNode;
  updateNodeData: (nodeId: string, newData: any) => void;
}

export const FlowProvider = ({ children, updateNodeData }: FlowProviderProps) => {
  return (
    <FlowContext.Provider value={{ updateNodeData }}>
      {children}
    </FlowContext.Provider>
  );
};

