import { PlotState } from '@/types/PlotState';
import { plotMeta } from '@/data/plotMeta';

export const buildPlotPath = (plotState: PlotState): string => {
  const { currentPlotType, eta_c, epsilon_G, N, M, rule } = plotState;
  
  // Find matching plot metadata entry
  const matchingPlot = plotMeta.find(entry => {
    // Match plot type
    if (entry.plotType !== currentPlotType) return false;
    
    // Match all non-undefined parameters
    const params = entry.params;
    if (params.eta_c !== undefined && params.eta_c !== eta_c) return false;
    if (params.epsilon_G !== undefined && params.epsilon_G !== epsilon_G) return false;
    if (params.N !== undefined && params.N !== N) return false;
    if (params.M !== undefined && params.M !== M) return false;
    if (params.rule !== undefined && params.rule !== rule) return false;
    
    return true;
  });

  if (!matchingPlot) {
    console.error(`No matching plot found for state:`, plotState);
    return import.meta.env.BASE_URL.replace(/\/$/, '') + '/comparison_plots/default_plot.svg';
  }

  // Ensure we don't double up slashes when concatenating paths
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const relPath = matchingPlot.relPath.replace(/^\//, '');
  return `${base}/${relPath}`;
};
