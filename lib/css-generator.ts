import type { CustomEdge, CustomNode, OperationType } from "./types";

export type CSSVariable = {
  name: string;
  value: string;
};

type ExpressionContext = {
  edges: CustomEdge[];
  nodeMap: Map<string, CustomNode>;
  exportedNodeVariables: Map<string, string>;
};

const generateNodeId = () =>
  `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Get all upstream node IDs that feed into a given node
const getUpstreamNodeIds = (
  nodeId: string,
  edges: CustomEdge[],
  visited = new Set<string>()
): Set<string> => {
  if (visited.has(nodeId)) {
    return visited;
  }
  visited.add(nodeId);

  const inputEdges = edges.filter((edge) => edge.target === nodeId);
  for (const edge of inputEdges) {
    getUpstreamNodeIds(edge.source, edges, visited);
  }

  return visited;
};

// Check if output A depends on output B (B's source is in A's upstream)
const checkDependsOnOutput = (
  outputA: string,
  outputB: string,
  outputToSource: Map<string, string>,
  edges: CustomEdge[]
): boolean => {
  const sourceA = outputToSource.get(outputA);
  const sourceB = outputToSource.get(outputB);
  if (!(sourceA && sourceB) || outputA === outputB) {
    return false;
  }
  const upstreamA = getUpstreamNodeIds(sourceA, edges);
  return upstreamA.has(sourceB);
};

// Find next node with no remaining dependencies
const findNextIndependentNode = (
  remaining: Set<string>,
  outputToSource: Map<string, string>,
  edges: CustomEdge[]
): string | null => {
  for (const nodeId of remaining) {
    let hasDependency = false;
    for (const otherId of remaining) {
      if (
        nodeId !== otherId &&
        checkDependsOnOutput(nodeId, otherId, outputToSource, edges)
      ) {
        hasDependency = true;
        break;
      }
    }
    if (!hasDependency) {
      return nodeId;
    }
  }
  return null;
};

// Build map of output node ID to its source node ID
const buildOutputToSourceMap = (
  outputNodes: CustomNode[],
  edges: CustomEdge[]
): Map<string, string> => {
  const outputToSource = new Map<string, string>();
  for (const outputNode of outputNodes) {
    const inputEdge = edges.find((edge) => edge.target === outputNode.id);
    if (inputEdge) {
      outputToSource.set(outputNode.id, inputEdge.source);
    }
  }
  return outputToSource;
};

// Add all remaining nodes to sorted array (handles cycles)
const addRemainingNodes = (
  remaining: Set<string>,
  nodeById: Map<string, CustomNode>,
  sorted: CustomNode[]
): void => {
  for (const nodeId of remaining) {
    const node = nodeById.get(nodeId);
    if (node) {
      sorted.push(node);
    }
  }
};

// Topologically sort outputs so dependencies come before dependents
const topologicalSortOutputs = (
  outputNodes: CustomNode[],
  edges: CustomEdge[]
): CustomNode[] => {
  if (outputNodes.length === 0) {
    return [];
  }

  const outputToSource = buildOutputToSourceMap(outputNodes, edges);
  const sorted: CustomNode[] = [];
  const remaining = new Set(outputNodes.map((n) => n.id));
  const nodeById = new Map(outputNodes.map((n) => [n.id, n]));

  while (remaining.size > 0) {
    const found = findNextIndependentNode(remaining, outputToSource, edges);

    if (found) {
      const foundNode = nodeById.get(found);
      if (foundNode) {
        sorted.push(foundNode);
      }
      remaining.delete(found);
    } else {
      addRemainingNodes(remaining, nodeById, sorted);
      break;
    }
  }

  return sorted;
};

const processInputColorNode = (
  node: CustomNode,
  variables: CSSVariable[],
  exportedNodeVariables: Map<string, string>
): void => {
  const data = node.data as { name: string; color: string };
  if (data.name) {
    variables.push({
      name: `--${data.name}`,
      value: data.color || "oklch(0.5 0.2 180)",
    });
    exportedNodeVariables.set(node.id, data.name);
  }
};

const processInputNumberNode = (
  node: CustomNode,
  variables: CSSVariable[],
  exportedNodeVariables: Map<string, string>
): void => {
  const data = node.data as { name: string; value: number };
  if (data.name) {
    variables.push({
      name: `--${data.name}`,
      value: data.value?.toString() || "0",
    });
    exportedNodeVariables.set(node.id, data.name);
  }
};

const processOutputNode = (
  node: CustomNode,
  variables: CSSVariable[],
  context: ExpressionContext
): void => {
  const outputData = node.data as { name: string; inputNodeId: string };
  if (!outputData.name) {
    return;
  }

  const inputEdge = context.edges.find((edge) => edge.target === node.id);
  if (!inputEdge) {
    return;
  }

  const inputNode = context.nodeMap.get(inputEdge.source);
  if (!inputNode) {
    return;
  }

  const expression = generateExpression(inputNode, context);
  variables.push({
    name: `--${outputData.name}`,
    value: expression,
  });
  // Mark this source node as exported so subsequent outputs can reference it
  context.exportedNodeVariables.set(inputEdge.source, outputData.name);
};

export const generateCSSVariables = (
  nodes: CustomNode[],
  edges: CustomEdge[]
): CSSVariable[] => {
  const variables: CSSVariable[] = [];
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  // Map from node ID to the CSS variable name it's exported as
  const exportedNodeVariables = new Map<string, string>();

  // Generate input variables
  for (const node of nodes) {
    if (node.type === "inputColor") {
      processInputColorNode(node, variables, exportedNodeVariables);
    } else if (node.type === "inputNumber") {
      processInputNumberNode(node, variables, exportedNodeVariables);
    }
  }

  // Get output nodes and sort them by dependency order
  const outputNodes = nodes.filter((n) => n.type === "output");
  const sortedOutputNodes = topologicalSortOutputs(outputNodes, edges);

  const context: ExpressionContext = {
    edges,
    nodeMap,
    exportedNodeVariables,
  };

  // Generate output variables in dependency order
  for (const node of sortedOutputNodes) {
    processOutputNode(node, variables, context);
  }

  return variables;
};

const generateInputColorExpression = (node: CustomNode): string => {
  const data = node.data as { name: string; color: string };
  return data.name ? `var(--${data.name})` : data.color || "oklch(0.5 0.2 180)";
};

const generateInputNumberExpression = (node: CustomNode): string => {
  const data = node.data as { name: string; value: number };
  return data.name ? `var(--${data.name})` : data.value?.toString() || "0";
};

const getOperationInputs = (
  node: CustomNode,
  context: ExpressionContext
): string[] => {
  const inputEdges = context.edges
    .filter((edge) => edge.target === node.id)
    .sort((a, b) => {
      const aHandle = a.targetHandle || "";
      const bHandle = b.targetHandle || "";
      return aHandle.localeCompare(bHandle);
    });

  return inputEdges.map((edge) => {
    const inputNode = context.nodeMap.get(edge.source);
    if (!inputNode) {
      return "";
    }
    return generateExpression(inputNode, context);
  });
};

const generateOperationNodeExpression = (
  node: CustomNode,
  context: ExpressionContext
): string => {
  let operation = node.type as OperationType;

  // For lighten/darken nodes, check the isDarken flag in data
  if (node.type === "lighten" || node.type === "darken") {
    const nodeData = node.data as { isDarken?: boolean };
    const isDarken = nodeData.isDarken ?? node.type === "darken";
    operation = isDarken ? "darken" : "lighten";
  }

  const inputs = getOperationInputs(node, context);
  return generateOperationExpression(operation, inputs);
};

const generateExpression = (
  node: CustomNode,
  context: ExpressionContext
): string => {
  // Check if this node is already exported as a CSS variable
  const existingVar = context.exportedNodeVariables.get(node.id);
  if (existingVar) {
    return `var(--${existingVar})`;
  }

  if (node.type === "inputColor") {
    return generateInputColorExpression(node);
  }

  if (node.type === "inputNumber") {
    return generateInputNumberExpression(node);
  }

  // Handle operation nodes (they are now individual node types)
  const operationTypes: OperationType[] = [
    "lighten",
    "darken",
    "saturate",
    "desaturate",
    "rotate",
    "mix",
    "invert",
    "complementary",
    "add",
    "subtract",
    "multiply",
    "divide",
  ];

  if (operationTypes.includes(node.type as OperationType)) {
    return generateOperationNodeExpression(node, context);
  }

  return "";
};

const generateAmountBasedExpression = (
  operation: OperationType,
  colorInput: string,
  amountInput: string
): string => {
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
    default:
      return colorInput;
  }
};

const generateMathExpression = (
  operation: OperationType,
  inputs: string[]
): string => {
  switch (operation) {
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

const generateColorMixExpression = (inputs: string[]): string => {
  if (inputs.length >= 2) {
    return `color-mix(in oklch, ${inputs[0]}, ${inputs[1]})`;
  }
  return inputs[0] || "";
};

const generateInvertExpression = (inputs: string[]): string => {
  if (inputs.length >= 1) {
    const colorInput = inputs[0] || "oklch(0.5 0.2 180)";
    return `oklch(from ${colorInput} calc(1 - l) c h)`;
  }
  return inputs[0] || "";
};

const generateComplementaryExpression = (inputs: string[]): string => {
  if (inputs.length >= 1) {
    const colorInput = inputs[0] || "oklch(0.5 0.2 180)";
    return `oklch(from ${colorInput} l c calc(h + 180))`;
  }
  return inputs[0] || "";
};

const generateOperationExpression = (
  operation: OperationType,
  inputs: string[]
): string => {
  if (inputs.length === 0) {
    return "";
  }

  // Color operations that need a color input and optionally an amount
  const amountOperations = [
    "lighten",
    "darken",
    "saturate",
    "desaturate",
    "rotate",
  ];

  if (amountOperations.includes(operation)) {
    const colorInput = inputs[0] || "oklch(0.5 0.2 180)";
    const amountInput = inputs[1] || (operation === "rotate" ? "30" : "0.1");
    return generateAmountBasedExpression(operation, colorInput, amountInput);
  }

  switch (operation) {
    case "mix":
      return generateColorMixExpression(inputs);
    case "invert":
      return generateInvertExpression(inputs);
    case "complementary":
      return generateComplementaryExpression(inputs);
    case "add":
    case "subtract":
    case "multiply":
    case "divide":
      return generateMathExpression(operation, inputs);
    default:
      return inputs[0] || "";
  }
};

export { generateNodeId };
