import { describe, it, expect, vi } from 'vitest';
import { buildPlotPath } from '../../src/utils/pathBuilder';
import { plotMeta } from '../../src/data/plotMeta';

// Mock plotMeta
vi.mock('../../src/data/plotMeta', () => ({
  plotMeta: [
    {
      plotType: "Distance-ratio",
      params: {
        N: 1024,
        M: 1024,
      },
      relPath: "comparison_plots/cross_param/distance_ratio_N1024_M1024.png",
    },
    {
      plotType: "Advantage heatmaps",
      params: {
        eta_c: 0.3,
        epsilon_G: 0.0001,
        rule: "SKR",
      },
      relPath: "comparison_plots/advantage_analysis/heatmap_dist_gain_SKR_etac0.3_epsg0.0001.svg",
    },
  ],
}));

describe('buildPlotPath', () => {
  it('should find exact match for Distance-ratio plot', () => {
    const plotState = {
      currentPlotType: "Distance-ratio",
      eta_c: 0.3,
      epsilon_G: 0.0001,
      N: 1024,
      M: 1024,
      rule: "SKR",
    };

    expect(buildPlotPath(plotState)).toBe('/comparison_plots/cross_param/distance_ratio_N1024_M1024.png');
  });

  it('should find match ignoring irrelevant parameters for Distance-ratio', () => {
    const plotState = {
      currentPlotType: "Distance-ratio",
      eta_c: 0.5, // Different but irrelevant for Distance-ratio
      epsilon_G: 0.001, // Different but irrelevant for Distance-ratio
      N: 1024,
      M: 1024,
      rule: "F_th 0.95", // Different but irrelevant for Distance-ratio
    };

    expect(buildPlotPath(plotState)).toBe('/comparison_plots/cross_param/distance_ratio_N1024_M1024.png');
  });

  it('should find exact match for Advantage heatmaps', () => {
    const plotState = {
      currentPlotType: "Advantage heatmaps",
      eta_c: 0.3,
      epsilon_G: 0.0001,
      N: 1024, // Irrelevant for Advantage heatmaps
      M: 1024, // Irrelevant for Advantage heatmaps
      rule: "SKR",
    };

    expect(buildPlotPath(plotState)).toBe('/comparison_plots/advantage_analysis/heatmap_dist_gain_SKR_etac0.3_epsg0.0001.svg');
  });

  it('should return default plot when no match found', () => {
    const plotState = {
      currentPlotType: "Distance-ratio",
      eta_c: 0.3,
      epsilon_G: 0.0001,
      N: 2048, // No match with this N value
      M: 1024,
      rule: "SKR",
    };

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(buildPlotPath(plotState)).toBe('/comparison_plots/default_plot.svg');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
}); 