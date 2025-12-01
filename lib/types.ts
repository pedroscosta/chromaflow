import { Node, Edge } from "reactflow";

export type NodeType =
  | "inputColor"
  | "inputNumber"
  | "lighten"
  | "darken"
  | "saturate"
  | "desaturate"
  | "rotate"
  | "mix"
  | "add"
  | "subtract"
  | "multiply"
  | "divide"
  | "output";

export type OperationType =
  | "lighten"
  | "darken"
  | "saturate"
  | "desaturate"
  | "rotate"
  | "mix"
  | "add"
  | "subtract"
  | "multiply"
  | "divide";

export interface InputColorData {
  name: string;
  color: string; // OKLCH format
}

export interface InputNumberData {
  name: string;
  value: number;
}

export interface OutputData {
  name: string;
  inputNodeId: string; // Node ID to output
}

export type NodeData = InputColorData | InputNumberData | OutputData | Record<string, never>;

export interface CustomNode extends Node {
  type: NodeType;
  data: NodeData;
}

export interface CustomEdge extends Edge {}

export interface FlowState {
  nodes: CustomNode[];
  edges: CustomEdge[];
}

