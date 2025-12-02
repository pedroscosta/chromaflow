<div align="center">

# Chromaflow

**A visual flow editor for creating parametric color palettes and generating CSS variables**

[![X (Twitter)](https://img.shields.io/badge/X-@pedroscosta_-1DA1F2?style=flat&logo=x&logoColor=white)](https://x.com/pedroscosta_)

</div>

---

## Features

- **Visual Flow Editor**: Drag and drop nodes to create complex color transformations
- **Color Operations**: Mix, lighten, saturate, rotate, and multiply colors
- **CSS Variable Generation**: Automatically generate CSS custom properties from your palette
- **Import/Export**: Save and load your palette configurations as JSON
- **Real-time Preview**: See your color changes update in real-time
- **Modern UI**: Built with Next.js, React Flow, and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/pedroscosta/chromaflow.git
cd chromaflow
```

2. Install dependencies:
```bash
bun install
```

3. Run the development server:
```bash
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Add Nodes**: Drag nodes from the sidebar onto the canvas
2. **Connect Nodes**: Connect output handles to input handles to create color transformations
3. **Configure**: Click on nodes to configure their properties
4. **Export**: Click "Export CSS" to generate CSS variables from your palette
5. **Save/Load**: Use the Export/Import buttons to save and load your configurations

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) 16
- **UI Library**: [React](https://react.dev) 19
- **Flow Editor**: [React Flow](https://xyflow.com)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **UI Components**: [Radix UI](https://www.radix-ui.com)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs)
- **Color Processing**: [Color.js](https://colorjs.io)
- **Icons**: [Lucide React](https://lucide.dev)

## Available Nodes

- **Input Color**: Define base colors
- **Input Number**: Provide numeric values for operations
- **Mix**: Blend two colors together
- **Lighten**: Lighten a color by a percentage
- **Saturate**: Adjust color saturation
- **Rotate**: Rotate hue in HSL color space
- **Multiply**: Multiply color channels
- **Add**: Add values to color channels
- **Output**: Generate CSS variable names

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built by [@pedroscosta_](https://x.com/pedroscosta_)
- Parametric concept inspired by [Linear](https://linear.app/now/how-we-redesigned-the-linear-ui#2.-appearance) and [Define](https://x.com/define_app/status/1995244617831502225)
- Color picker inspired by [Paper](https://paper.design)
