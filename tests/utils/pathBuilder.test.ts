import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildPlotPath } from '../../src/utils/pathBuilder';
import { PlotState } from '../../src/types/PlotState';

// Mock import.meta.env.BASE_URL
const originalEnv = import.meta.env;
beforeEach(() => {
  vi.stubGlobal('import', {
    meta: {
      env: {
        ...originalEnv,
        BASE_URL: '/global-epp-results/'
      }
    }
  });
});

afterEach(() => {
  vi.stubGlobal('import', {
    meta: {
      env: originalEnv
    }
  });
});

// Mock plotMeta
vi.mock('@/data/plotMeta', () => ({
  plotMeta: [
    {
      plotType: '3D global-schedule',
      params: { eta_c: 0.9, epsilon_G: 0.0001, N: 1024, M: 1024, rule: 'SKR' },
      relPath: 'comparison_plots/etac0.9_epsg0.0001/3d_visualization_N1024_M1024_SKR.svg'
    },
    {
      plotType: 'Advantage heatmaps',
      params: { eta_c: 0.9, epsilon_G: 0.001, rule: 'SKR' },
      relPath: 'comparison_plots/advantage_analysis/heatmap_dist_gain_SKR_etac0.9_epsg0.001.svg'
    },
    {
      plotType: 'Advantage heatmaps',
      params: { eta_c: 0.3, epsilon_G: 0.0001, rule: 'F_th 0.97' },
      relPath: 'comparison_plots/advantage_analysis/heatmap_dist_gain_F_th_0.97_etac0.3_epsg0.0001.svg'
    },
    {
      plotType: 'Advantage heatmaps',
      params: { eta_c: 1.0, epsilon_G: 0.001, rule: 'F_th 0.95' },
      relPath: 'comparison_plots/advantage_analysis/heatmap_dist_gain_F_th_0.95_etac1.0_epsg0.001.svg'
    }
  ]
}));

describe('buildPlotPath', () => {
  it('should find the correct plot and return its path with BASE_URL', () => {
    const plotState: PlotState = {
      currentPlotType: '3D global-schedule',
      eta_c: 0.9,
      epsilon_G: 0.0001,
      N: 1024,
      M: 1024,
      rule: 'SKR',
    };
    const expectedPath = '/comparison_plots/etac0.9_epsg0.0001/3d_visualization_N1024_M1024_SKR.svg';
    expect(buildPlotPath(plotState)).toBe(expectedPath);
  });

  it('should return default path with BASE_URL if no plot is found', () => {
    const plotState: PlotState = {
      currentPlotType: 'Non-existent plot type',
      eta_c: 0.9,
      epsilon_G: 0.0001,
      N: 1024,
      M: 1024,
      rule: 'SKR',
    };
    expect(buildPlotPath(plotState)).toBe('/comparison_plots/default_plot.svg');
  });

  it('should log an error if no plot is found', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const plotState: PlotState = {
      currentPlotType: 'Non-existent plot type',
      eta_c: 0.9,
      epsilon_G: 0.0001,
      N: 1024,
      M: 1024,
      rule: 'SKR',
    };
    buildPlotPath(plotState);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  describe('for Advantage heatmaps', () => {
    it('should return the correct path with BASE_URL for a specific SKR plot', () => {
      const plotState: PlotState = {
        currentPlotType: 'Advantage heatmaps',
        eta_c: 0.9,
        epsilon_G: 0.001,
        N: 1024,  // This will be ignored since it's not in the mock params
        M: 1024,  // This will be ignored since it's not in the mock params
        rule: 'SKR',
      };
      const expectedPath = '/comparison_plots/advantage_analysis/heatmap_dist_gain_SKR_etac0.9_epsg0.001.svg';
      const result = buildPlotPath(plotState);
      expect(result).toBe(expectedPath);
    });
  
    it('should return the correct path with BASE_URL for a specific F_th 0.97 plot', () => {
      const plotState: PlotState = {
        currentPlotType: 'Advantage heatmaps',
        eta_c: 0.3,
        epsilon_G: 0.0001,
        N: 512,  // This will be ignored since it's not in the mock params
        M: 2048, // This will be ignored since it's not in the mock params
        rule: 'F_th 0.97',
      };
      const expectedPath = '/comparison_plots/advantage_analysis/heatmap_dist_gain_F_th_0.97_etac0.3_epsg0.0001.svg';
      const result = buildPlotPath(plotState);
      expect(result).toBe(expectedPath);
    });
  
    it('should return the correct path with BASE_URL for a specific F_th 0.95 plot', () => {
      const plotState: PlotState = {
        currentPlotType: 'Advantage heatmaps',
        eta_c: 1.0,
        epsilon_G: 0.001,
        N: 256,  // This will be ignored since it's not in the mock params
        M: 1024, // This will be ignored since it's not in the mock params
        rule: 'F_th 0.95',
      };
      const expectedPath = '/comparison_plots/advantage_analysis/heatmap_dist_gain_F_th_0.95_etac1.0_epsg0.001.svg';
      const result = buildPlotPath(plotState);
      expect(result).toBe(expectedPath);
    });
  
    it('should return the default plot with BASE_URL if no match is found', () => {
      const plotState: PlotState = {
        currentPlotType: 'Advantage heatmaps',
        eta_c: 0.99, // A value that doesn't exist
        epsilon_G: 0.001,
        N: 1024,
        M: 1024,
        rule: 'SKR',
      };
      const expectedPath = '/comparison_plots/default_plot.svg';
      const result = buildPlotPath(plotState);
      expect(result).toBe(expectedPath);
    });

    it('should handle development BASE_URL correctly', () => {
      vi.stubGlobal('import', {
        meta: {
          env: {
            ...originalEnv,
            BASE_URL: '/'
          }
        }
      });

      const plotState: PlotState = {
        currentPlotType: 'Advantage heatmaps',
        eta_c: 0.9,
        epsilon_G: 0.001,
        N: 1024,  // This will be ignored since it's not in the mock params
        M: 1024,  // This will be ignored since it's not in the mock params
        rule: 'SKR',
      };
      const expectedPath = '/comparison_plots/advantage_analysis/heatmap_dist_gain_SKR_etac0.9_epsg0.001.svg';
      const result = buildPlotPath(plotState);
      expect(result).toBe(expectedPath);
    });
  });
}); 