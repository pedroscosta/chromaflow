import type { CustomEdge, CustomNode, OperationType } from "./types";

export type CSSVariable = {
  name: string;
  value: string;
};

const generateNodeId = () =>
  `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const generateCSSVariables = (
  nodes: CustomNode[],
  edges: CustomEdge[]
): CSSVariable[] => {
  const variables: CSSVariable[] = [];
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  // Generate input variables
  nodes.forEach((node) => {
    if (node.type === "inputColor") {
      const data = node.data as { name: string; color: string };
      if (data.name) {
        variables.push({
          name: `--${data.name}`,
          value: data.color || "oklch(0.5 0.2 180)",
        });
      }
    } else if (node.type === "inputNumber") {
      const data = node.data as { name: string; value: number };
      if (data.name) {
        variables.push({
          name: `--${data.name}`,
          value: data.value?.toString() || "0",
        });
      }
    }
  });

  // Generate output variables (parametric functions)
  nodes.forEach((node) => {
    if (node.type === "output") {
      const outputData = node.data as { name: string; inputNodeId: string };
      if (outputData.name) {
        // Find the input node connected to this output
        const inputEdge = edges.find((edge) => edge.target === node.id);
        if (inputEdge) {
          const inputNode = nodeMap.get(inputEdge.source);
          if (inputNode) {
            const expression = generateExpression(
              inputNode,
              nodes,
              edges,
              nodeMap
            );
            variables.push({
              name: `--${outputData.name}`,
              value: expression,
            });
          }
        }
      }
    }
  });

  return variables;
};

const generateExpression = (
  node: CustomNode,
  _allNodes: CustomNode[],
  edges: CustomEdge[],
  nodeMap: Map<string, CustomNode>
): string => {
  if (node.type === "inputColor") {
    const data = node.data as { name: string; color: string };
    return data.name
      ? `var(--${data.name})`
      : data.color || "oklch(0.5 0.2 180)";
  }

  if (node.type === "inputNumber") {
    const data = node.data as { name: string; value: number };
    return data.name ? `var(--${data.name})` : data.value?.toString() || "0";
  }

  // Handle operation nodes (they are now individual node types)
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
        return "";
      }
      return generateExpression(inputNode, _allNodes, edges, nodeMap);
    });

    return generateOperationExpression(operation, inputs);
  }

  return "";
};

const generateOperationExpression = (
  operation: OperationType,
  inputs: string[]
): string => {
  if (inputs.length === 0) {
    return "";
  }

  // Color operations that need a color input and optionally an amount
  const needsAmount = [
    "lighten",
    "darken",
    "saturate",
    "desaturate",
    "rotate",
  ].includes(operation);

  if (needsAmount) {
    // First input is color, second is amount (if provided)
    const colorInput = inputs[0] || "oklch(0.5 0.2 180)";
    const amountInput = inputs[1] || (operation === "rotate" ? "30" : "0.1");

    switch (operation) {
      case "lighten":
        return `oklch(from ${colorInput} calc(l + ${amountInput}) c h)`;
      case "darken":
        return `oklch(from ${colorInput} calc(l - ${amountInput}) c h)`;
      case "saturate":
        return `oklch(from ${colorInput} l calc(c + ${amountInput}) h)`;
      case "desaturate":
        return `oklch(from ${colorInput} l calc(c - ${amountInput}) h)`;
      case "rotate":
        return `oklch(from ${colorInput} l c calc(h + ${amountInput}))`;
    }
  }

  switch (operation) {
    case "mix":
      if (inputs.length >= 2) {
        return `color-mix(in oklch, ${inputs[0]}, ${inputs[1]})`;
      }
      return inputs[0] || "";
    case "add":
      return `calc(${inputs[0] || "0"} + ${inputs[1] || "0"})`;
    case "subtract":
      return `calc(${inputs[0] || "0"} - ${inputs[1] || "0"})`;
    case "multiply":
      return `calc(${inputs[0] || "0"} * ${inputs[1] || "1"})`;
    case "divide":
      return `calc(${inputs[0] || "0"} / ${inputs[1] || "1"})`;
    default:
      return inputs[0] || "";
  }
};

export { generateNodeId };
