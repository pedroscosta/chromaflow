import type { Edge, Node } from "@xyflow/react";

export type NodeType =
  | "inputColor"
  | "inputNumber"
  | "lighten"
  | "darken"
  | "saturate"
  | "desaturate"
  | "rotate"
  | "mix"
  | "invert"
  | "complementary"
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
  | "invert"
  | "complementary"
  | "add"
  | "subtract"
  | "multiply"
  | "divide";

export type InputColorData = {
  name: string;
  color: string; // OKLCH format
  [key: string]: unknown;
};

export type InputNumberData = {
  name: string;
  value: number;
  [key: string]: unknown;
};

export type OutputData = {
  name: string;
  inputNodeId: string; // Node ID to output
  [key: string]: unknown;
};

export type LightenDarkenData = {
  isDarken?: boolean;
  [key: string]: unknown;
};

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

export type FlowState = {
  nodes: CustomNode[];
  edges: CustomEdge[];
};
