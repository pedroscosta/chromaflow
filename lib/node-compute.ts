import Color from "colorjs.io";
import type { CustomEdge, CustomNode, OperationType } from "./types";

export const computeNodeOutput = (
  node: CustomNode,
  nodes: CustomNode[],
  edges: CustomEdge[]
): string | number | null => {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  if (node.type === "inputColor") {
    const data = node.data as { name: string; color: string };
    return data.color || "oklch(0.5 0.2 180)";
  }

  if (node.type === "inputNumber") {
    const data = node.data as { name: string; value: number };
    return data.value ?? 0;
  }

  const operationTypes: OperationType[] = [
    "lighten",
    "darken",
    "saturate",
    "desaturate",
    "rotate",
    "mix",
    "add",
    "subtract",
    "multiply",
    "divide",
  ];

  if (operationTypes.includes(node.type as OperationType)) {
    let operation = node.type as OperationType;

    // For lighten/darken nodes, check the isDarken flag in data
    if (node.type === "lighten" || node.type === "darken") {
      const nodeData = node.data as { isDarken?: boolean };
      const isDarken = nodeData.isDarken ?? node.type === "darken";
      operation = isDarken ? "darken" : "lighten";
    }

    // For saturate/desaturate nodes
    if (node.type === "saturate" || node.type === "desaturate") {
      const nodeData = node.data as { isDesaturate?: boolean };
      const isDesaturate = nodeData.isDesaturate ?? node.type === "desaturate";
      operation = isDesaturate ? "desaturate" : "saturate";
    }

    // For add/subtract nodes
    if (node.type === "add" || node.type === "subtract") {
      const nodeData = node.data as { isSubtract?: boolean };
      const isSubtract = nodeData.isSubtract ?? node.type === "subtract";
      operation = isSubtract ? "subtract" : "add";
    }

    // For multiply/divide nodes
    if (node.type === "multiply" || node.type === "divide") {
      const nodeData = node.data as { isDivide?: boolean };
      const isDivide = nodeData.isDivide ?? node.type === "divide";
      operation = isDivide ? "divide" : "multiply";
    }

    // Get input edges - sort by handle id to maintain order
    const inputEdges = edges
      .filter((edge) => edge.target === node.id)
      .sort((a, b) => {
        const aHandle = a.targetHandle || "";
        const bHandle = b.targetHandle || "";
        return aHandle.localeCompare(bHandle);
      });

    const inputs = inputEdges.map((edge) => {
      const inputNode = nodeMap.get(edge.source);
      if (!inputNode) {
        return null;
      }
      return computeNodeOutput(inputNode, nodes, edges);
    });

    return computeOperationValue(operation, inputs);
  }

  return null;
};

const computeOperationValue = (
  operation: OperationType,
  inputs: (string | number | null)[]
): string | number | null => {
  // Color operations that need a color input and optionally an amount
  const needsAmount = [
    "lighten",
    "darken",
    "saturate",
    "desaturate",
    "rotate",
  ].includes(operation);

  if (needsAmount) {
    const colorInput = inputs[0];
    const amountInput = inputs[1];

    if (typeof colorInput !== "string") {
      return null;
    }

    try {
      const color = new Color(colorInput);
      const amount =
        typeof amountInput === "number"
          ? amountInput
          : typeof amountInput === "string"
            ? Number.parseFloat(amountInput) || 0
            : operation === "rotate"
              ? 30
              : 0.1;

      const oklch = color.oklch;
      let newColor: Color;

      switch (operation) {
        case "lighten":
          newColor = new Color("oklch", [
            Math.min(1, oklch.l + amount),
            oklch.c,
            oklch.h ?? 0,
          ]);
          break;
        case "darken":
          newColor = new Color("oklch", [
            Math.max(0, oklch.l - amount),
            oklch.c,
            oklch.h ?? 0,
          ]);
          break;
        case "saturate":
          newColor = new Color("oklch", [
            oklch.l,
            Math.min(0.4, oklch.c + amount),
            oklch.h ?? 0,
          ]);
          break;
        case "desaturate":
          newColor = new Color("oklch", [
            oklch.l,
            Math.max(0, oklch.c - amount),
            oklch.h ?? 0,
          ]);
          break;
        case "rotate":
          newColor = new Color("oklch", [
            oklch.l,
            oklch.c,
            ((oklch.h ?? 0) + amount) % 360,
          ]);
          break;
        default:
          return colorInput;
      }

      return newColor.toString({ format: "oklch" });
    } catch {
      return colorInput;
    }
  }

  switch (operation) {
    case "mix": {
      const color1 = inputs[0];
      const color2 = inputs[1];

      if (typeof color1 !== "string" || typeof color2 !== "string") {
        return color1 ?? color2 ?? null;
      }

      try {
        const c1 = new Color(color1);
        const c2 = new Color(color2);
        const mixed = c1.mix(c2, 0.5, { space: "oklch" });
        return mixed.toString({ format: "oklch" });
      } catch {
        return color1;
      }
    }
    case "add": {
      const num1 =
        typeof inputs[0] === "number"
          ? inputs[0]
          : typeof inputs[0] === "string"
            ? Number.parseFloat(inputs[0]) || 0
            : 0;
      const num2 =
        typeof inputs[1] === "number"
          ? inputs[1]
          : typeof inputs[1] === "string"
            ? Number.parseFloat(inputs[1]) || 0
            : 0;
      return num1 + num2;
    }
    case "subtract": {
      const num1 =
        typeof inputs[0] === "number"
          ? inputs[0]
          : typeof inputs[0] === "string"
            ? Number.parseFloat(inputs[0]) || 0
            : 0;
      const num2 =
        typeof inputs[1] === "number"
          ? inputs[1]
          : typeof inputs[1] === "string"
            ? Number.parseFloat(inputs[1]) || 0
            : 0;
      return num1 - num2;
    }
    case "multiply": {
      const num1 =
        typeof inputs[0] === "number"
          ? inputs[0]
          : typeof inputs[0] === "string"
            ? Number.parseFloat(inputs[0]) || 1
            : 1;
      const num2 =
        typeof inputs[1] === "number"
          ? inputs[1]
          : typeof inputs[1] === "string"
            ? Number.parseFloat(inputs[1]) || 1
            : 1;
      return num1 * num2;
    }
    case "divide": {
      const num1 =
        typeof inputs[0] === "number"
          ? inputs[0]
          : typeof inputs[0] === "string"
            ? Number.parseFloat(inputs[0]) || 0
            : 0;
      const num2 =
        typeof inputs[1] === "number"
          ? inputs[1]
          : typeof inputs[1] === "string"
            ? Number.parseFloat(inputs[1]) || 1
            : 1;
      return num2 !== 0 ? num1 / num2 : 0;
    }
    default:
      return inputs[0] ?? null;
  }
};
