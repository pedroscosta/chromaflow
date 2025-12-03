export const initialValue = {
  nodes: [
    {
      id: "node_1764789629795_q5tzrpu52",
      type: "inputColor",
      position: {
        x: -12.176_946_281_801_435,
        y: 81.024_450_913_240_9,
      },
      data: {
        name: "base-color",
        color: "oklch(43.268% 0.12114 249.58)",
      },
      measured: {
        width: 276,
        height: 158,
      },
      selected: false,
      dragging: false,
    },
    {
      id: "node_1764789629795_magw6bj6t",
      type: "inputNumber",
      position: {
        x: 20.011_543_672_274_57,
        y: 340.025_708_628_142_75,
      },
      data: {
        name: "lighten-amount",
        value: 0.15,
      },
      measured: {
        width: 236,
        height: 158,
      },
      selected: false,
      dragging: false,
    },
    {
      id: "node_1764789629795_p42fth5pp",
      type: "lighten",
      position: {
        x: 381.870_392_520_112_9,
        y: 152.266_200_934_985_9,
      },
      data: {
        isDarken: false,
      },
      measured: {
        width: 275,
        height: 180,
      },
      selected: false,
      dragging: false,
    },
    {
      id: "node_1764789629795_ynrjgpm6g",
      type: "lighten",
      position: {
        x: 763.041_065_750_03,
        y: 255.511_241_587_824_26,
      },
      data: {
        isDarken: false,
      },
      measured: {
        width: 275,
        height: 180,
      },
      selected: false,
      dragging: false,
    },
    {
      id: "node_1764789629795_c576a4gk2",
      type: "lighten",
      position: {
        x: 1122.347_118_295_971_3,
        y: 426.938_190_932_551_8,
      },
      data: {
        isDarken: false,
      },
      measured: {
        width: 275,
        height: 180,
      },
      selected: false,
      dragging: false,
    },
    {
      id: "node_1764789629795_fkwq23isx",
      type: "output",
      position: {
        x: 700.271_623_885_630_1,
        y: 95.052_394_814_087_63,
      },
      data: {
        name: "step-1",
        inputNodeId: "node_1764789629795_p42fth5pp",
      },
      measured: {
        width: 150,
        height: 110,
      },
      selected: false,
      dragging: false,
    },
    {
      id: "node_1764789629795_ftgwv7tua",
      type: "output",
      position: {
        x: 1110.028_671_976_515_2,
        y: 182.301_130_811_044_35,
      },
      data: {
        name: "step-2",
        inputNodeId: "node_1764789629795_ynrjgpm6g",
      },
      measured: {
        width: 150,
        height: 110,
      },
      selected: false,
      dragging: false,
    },
    {
      id: "node_1764789629795_pz4ktxtdk",
      type: "output",
      position: {
        x: 1452.813_760_470_969_6,
        y: 346.999_392_930_462_8,
      },
      data: {
        name: "step-3",
        inputNodeId: "node_1764789629795_c576a4gk2",
      },
      measured: {
        width: 150,
        height: 110,
      },
      selected: false,
      dragging: false,
    },
  ],
  edges: [
    {
      id: "edge-node_1764789629795_q5tzrpu52-node_1764789629795_p42fth5pp-color",
      source: "node_1764789629795_q5tzrpu52",
      target: "node_1764789629795_p42fth5pp",
      sourceHandle: null,
      targetHandle: "input-0",
    },
    {
      id: "edge-node_1764789629795_magw6bj6t-node_1764789629795_p42fth5pp-amount",
      source: "node_1764789629795_magw6bj6t",
      target: "node_1764789629795_p42fth5pp",
      sourceHandle: null,
      targetHandle: "input-1",
    },
    {
      id: "edge-node_1764789629795_p42fth5pp-node_1764789629795_ynrjgpm6g-color",
      source: "node_1764789629795_p42fth5pp",
      target: "node_1764789629795_ynrjgpm6g",
      sourceHandle: null,
      targetHandle: "input-0",
    },
    {
      id: "edge-node_1764789629795_magw6bj6t-node_1764789629795_ynrjgpm6g-amount",
      source: "node_1764789629795_magw6bj6t",
      target: "node_1764789629795_ynrjgpm6g",
      sourceHandle: null,
      targetHandle: "input-1",
    },
    {
      id: "edge-node_1764789629795_ynrjgpm6g-node_1764789629795_c576a4gk2-color",
      source: "node_1764789629795_ynrjgpm6g",
      target: "node_1764789629795_c576a4gk2",
      sourceHandle: null,
      targetHandle: "input-0",
    },
    {
      id: "edge-node_1764789629795_magw6bj6t-node_1764789629795_c576a4gk2-amount",
      source: "node_1764789629795_magw6bj6t",
      target: "node_1764789629795_c576a4gk2",
      sourceHandle: null,
      targetHandle: "input-1",
    },
    {
      id: "edge-node_1764789629795_p42fth5pp-node_1764789629795_fkwq23isx",
      source: "node_1764789629795_p42fth5pp",
      target: "node_1764789629795_fkwq23isx",
      sourceHandle: null,
      targetHandle: null,
    },
    {
      id: "edge-node_1764789629795_ynrjgpm6g-node_1764789629795_ftgwv7tua",
      source: "node_1764789629795_ynrjgpm6g",
      target: "node_1764789629795_ftgwv7tua",
      sourceHandle: null,
      targetHandle: null,
    },
    {
      id: "edge-node_1764789629795_c576a4gk2-node_1764789629795_pz4ktxtdk",
      source: "node_1764789629795_c576a4gk2",
      target: "node_1764789629795_pz4ktxtdk",
      sourceHandle: null,
      targetHandle: null,
    },
  ],
  version: "1.0.0",
  exportedAt: "2025-12-03T19:24:17.920Z",
};
