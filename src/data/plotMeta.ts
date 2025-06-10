
export interface PlotData {
  plotType: string;
  params: {
    eta_c?: number;
    epsilon_g?: number;
    n?: number;
    m?: number;
    rule?: string;
  };
  relPath: string;
}

export const plotTypes = [
  "3D Global Schedule",
  "Best Strategies 2D", 
  "SKR vs F_th",
  "Distance Ratio",
  "Advantage Heatmaps",
  "Plateau Grid",
  "Threshold Heatmap",
  "η_c Comparisons"
];

// Dependency matrix - which parameters affect each plot type
export const dependencyMatrix: Record<string, string[]> = {
  "3D Global Schedule": ["eta_c", "epsilon_g", "n", "m", "rule"],
  "Best Strategies 2D": ["eta_c", "epsilon_g", "n", "m"],
  "SKR vs F_th": ["eta_c", "epsilon_g", "n", "m"],
  "Distance Ratio": ["n", "m"],
  "Advantage Heatmaps": ["eta_c", "epsilon_g", "rule"],
  "Plateau Grid": [],
  "Threshold Heatmap": ["m"],
  "η_c Comparisons": ["epsilon_g", "n", "m", "rule"]
};

// Available parameter values
export const parameterValues = {
  eta_c: [0.1, 0.3, 0.5, 0.7, 0.9],
  epsilon_g: [0.001, 0.01, 0.05, 0.1],
  n: [64, 128, 256, 512],
  m: [128, 256, 512, 1024],
  rule: ["SKR", "F_th 0.95", "F_th 0.97", "Manual"]
};

// Mock plot data - in real app this would be auto-generated
export const plotData: PlotData[] = [
  {
    plotType: "3D Global Schedule",
    params: { eta_c: 0.5, epsilon_g: 0.001, n: 256, m: 512, rule: "SKR" },
    relPath: "repeater_protocol/comparison_plots/etac0.5_epsg0.001/3d_visualization_SKR_N256_M512_etac0.5_epsg0.001.svg"
  },
  {
    plotType: "Best Strategies 2D",
    params: { eta_c: 0.5, epsilon_g: 0.001, n: 256, m: 512 },
    relPath: "repeater_protocol/comparison_plots/etac0.5_epsg0.001/best_strategies_N256_M512.svg"
  }
];
