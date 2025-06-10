import { describe, it, expect } from 'vitest';
import path from 'path';

// Import the functions we want to test
// Note: We'll need to export these functions in generatePlotMeta.ts
import { parseFileMeta, PlotMeta } from '../generatePlotMeta';
import {
  parseEtaC,
  parseEpsilonG,
  parseN,
  parseM,
  parseRule,
  PARAMETER_VALUES
} from '../generatePlotMeta';

describe('Plot Metadata Generator', () => {
  describe('parseFileMeta', () => {
    it('should parse 3D visualization file correctly', () => {
      const filePath = 'comparison_plots/etac0.5_epsg0.001/3d_visualization_SKR_N256_M512_etac0.5_epsg0.001.svg';
      const expected: PlotMeta = {
        plotType: '3D global-schedule',
        params: {
          eta_c: 0.5,
          epsilon_G: 0.001,
          N: 256,
          M: 512,
          rule: 'SKR'
        },
        relPath: filePath
      };
      
      expect(parseFileMeta(filePath)).toEqual(expected);
    });
    
    it('should parse best strategies file correctly', () => {
      const filePath = 'comparison_plots/etac0.5_epsg0.001/best_strategies_N256_M512.svg';
      const expected: PlotMeta = {
        plotType: 'Best strategies 2D',
        params: {
          eta_c: 0.5,
          epsilon_G: 0.001,
          N: 256,
          M: 512
        },
        relPath: filePath
      };
      
      expect(parseFileMeta(filePath)).toEqual(expected);
    });
    
    it('should parse threshold analysis file correctly', () => {
      const filePath = 'comparison_plots/threshold_analysis/consolidated_threshold_N_heatmap.svg';
      const expected: PlotMeta = {
        plotType: 'Threshold heatmap',
        params: {},
        relPath: filePath
      };
      
      expect(parseFileMeta(filePath)).toEqual(expected);
    });
    
    it('should throw error for unknown plot type', () => {
      const filePath = 'comparison_plots/unknown_file_type.svg';
      expect(() => parseFileMeta(filePath)).toThrow();
    });
  });
});

describe('Parameter parsing', () => {
  describe('parseEtaC', () => {
    it('should parse valid eta_c values', () => {
      expect(parseEtaC('etac0.3')).toBe(0.3);
      expect(parseEtaC('etac0.5')).toBe(0.5);
      expect(parseEtaC('etac0.9')).toBe(0.9);
      expect(parseEtaC('etac1.0')).toBe(1.0);
    });

    it('should return undefined for invalid eta_c values', () => {
      expect(parseEtaC('etac0.4')).toBeUndefined();
      expect(parseEtaC('etac2.0')).toBeUndefined();
      expect(parseEtaC('invalid')).toBeUndefined();
    });
  });

  describe('parseEpsilonG', () => {
    it('should parse valid epsilon_G values', () => {
      expect(parseEpsilonG('epsg0.0001')).toBe(0.0001);
      expect(parseEpsilonG('epsg0.001')).toBe(0.001);
    });

    it('should return undefined for invalid epsilon_G values', () => {
      expect(parseEpsilonG('epsg0.01')).toBeUndefined();
      expect(parseEpsilonG('invalid')).toBeUndefined();
    });
  });

  describe('parseN', () => {
    it('should parse valid N values', () => {
      PARAMETER_VALUES.N.forEach(n => {
        expect(parseN(`N${n}`)).toBe(n);
      });
    });

    it('should return undefined for invalid N values', () => {
      expect(parseN('N100')).toBeUndefined();
      expect(parseN('invalid')).toBeUndefined();
    });
  });

  describe('parseM', () => {
    it('should parse valid M values', () => {
      PARAMETER_VALUES.M.forEach(m => {
        expect(parseM(`M${m}`)).toBe(m);
      });
    });

    it('should return undefined for invalid M values', () => {
      expect(parseM('M100')).toBeUndefined();
      expect(parseM('invalid')).toBeUndefined();
    });
  });

  describe('parseRule', () => {
    it('should parse valid rule values', () => {
      expect(parseRule('SKR')).toBe('SKR');
      expect(parseRule('F_th_0.95')).toBe('F_th 0.95');
      expect(parseRule('F_th_0.97')).toBe('F_th 0.97');
    });

    it('should return undefined for invalid rule values', () => {
      expect(parseRule('F_th_0.96')).toBeUndefined();
      expect(parseRule('invalid')).toBeUndefined();
    });
  });
}); 