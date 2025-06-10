import { PlotState } from '@/components/PlotExplorer';

export const buildPlotPath = (plotState: PlotState): string => {
  const { currentPlotType, eta_c, epsilon_G, N, M, rule } = plotState;
  
  // Mock path building - in real app this would match the actual file structure
  const baseDir = 'repeater_protocol/comparison_plots';
  
  switch (currentPlotType) {
    case '3D Global Schedule':
      return `${baseDir}/etac${eta_c}_epsg${epsilon_G}/3d_visualization_${rule}_N${N}_M${M}_etac${eta_c}_epsg${epsilon_G}.svg`;
    
    case 'Best Strategies 2D':
      return `${baseDir}/etac${eta_c}_epsg${epsilon_G}/best_strategies_N${N}_M${M}.svg`;
    
    case 'SKR vs F_th':
      return `${baseDir}/etac${eta_c}_epsg${epsilon_G}/skr_vs_fth_N${N}_M${M}.png`;
    
    case 'Distance Ratio':
      return `${baseDir}/cross_param/distance_ratio_N${N}_M${M}.png`;
    
    case 'Advantage Heatmaps':
      return `${baseDir}/advantage_analysis/heatmap_dist_gain_${rule}_etac${eta_c}_epsg${epsilon_G}.svg`;
    
    case 'Plateau Grid':
      return `${baseDir}/advantage_analysis/grid_plateau_ratio.svg`;
    
    case 'Threshold Heatmap':
      return `${baseDir}/threshold_analysis/consolidated_threshold_N_heatmap.svg`;
    
    case 'η_c Comparisons':
      return `${baseDir}/eta_c_comparison/manual_advantage_over_fth_distance_N${N}_M${M}.png`;
    
    default:
      return `${baseDir}/default_plot.svg`;
  }
};
