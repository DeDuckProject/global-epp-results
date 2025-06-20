import { describe, it, expect } from 'vitest';
import { plotTypes, dependencyMatrix } from '@/data/plotMeta';

describe('plotMeta', () => {
  it('should have dependency matrix entries for all plot types', () => {
    plotTypes.forEach(plotType => {
      expect(dependencyMatrix[plotType]).toBeDefined();
      expect(dependencyMatrix[plotType]).toEqual(
        expect.objectContaining({
          eta_c: expect.any(Boolean),
          epsilon_G: expect.any(Boolean),
          N: expect.any(Boolean),
          M: expect.any(Boolean),
          rule: expect.any(Boolean),
        })
      );
    });
  });
}); 