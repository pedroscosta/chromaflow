import { Edge, Node } from "@xyflow/react";

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
  [key: string]: unknown;
}

export interface InputNumberData {
  name: string;
  value: number;
  [key: string]: unknown;
}

export interface OutputData {
  name: string;
  inputNodeId: string; // Node ID to output
  [key: string]: unknown;
}

export interface LightenDarkenData {
  isDarken?: boolean;
  [key: string]: unknown;
}

export type NodeData =
  | InputColorData
  | InputNumberData
  | OutputData
  | LightenDarkenData
  | Record<string, unknown>;

export interface CustomNode extends Node {
  type: NodeType;
  data: NodeData;
}

export interface CustomEdge extends Edge {}

export interface FlowState {
  nodes: CustomNode[];
  edges: CustomEdge[];
}
