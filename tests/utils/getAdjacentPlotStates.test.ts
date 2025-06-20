import { describe, it, expect, vi } from 'vitest';
import { getAdjacentPlotStates } from '@/utils/getAdjacentPlotStates';
import { parameterValues } from '@/data/plotMeta';
import { getAvailableRules } from '@/utils/getAvailableRules';

// Mock getAvailableRules
vi.mock('@/utils/getAvailableRules', () => ({
  getAvailableRules: vi.fn()
}));

describe('getAdjacentPlotStates', () => {
  const baseState = {
    currentPlotType: '3D+global-schedule',
    eta_c: 0.3,
    epsilon_G: 0.0001,
    N: 256,
    M: 2048,
    rule: 'F_th_0.99'
  };

  it('should return adjacent states for numeric parameters', () => {
    vi.mocked(getAvailableRules).mockReturnValue(new Set(['F_th_0.99']));

    const adjacentStates = getAdjacentPlotStates(baseState);
    
    // Check eta_c adjacency
    expect(Array.from(adjacentStates)).toContainEqual({
      ...baseState,
      eta_c: 0.5 // Next value in parameterValues.eta_c
    });

    // Check N adjacency
    expect(Array.from(adjacentStates)).toContainEqual({
      ...baseState,
      N: 128 // Previous value in parameterValues.N
    });
    expect(Array.from(adjacentStates)).toContainEqual({
      ...baseState,
      N: 512 // Next value in parameterValues.N
    });
  });

  it('should handle edge cases for numeric parameters', () => {
    vi.mocked(getAvailableRules).mockReturnValue(new Set(['F_th_0.99']));

    const edgeState = {
      ...baseState,
      eta_c: parameterValues.eta_c[0], // First value
      N: parameterValues.N[parameterValues.N.length - 1] // Last value
    };

    const adjacentStates = getAdjacentPlotStates(edgeState);
    
    // Should only have next value for eta_c
    expect(Array.from(adjacentStates).filter(s => s.eta_c !== edgeState.eta_c)).toHaveLength(1);
    // Should only have previous value for N
    expect(Array.from(adjacentStates).filter(s => s.N !== edgeState.N)).toHaveLength(1);
  });

  it('should include alternative rules when available', () => {
    vi.mocked(getAvailableRules).mockReturnValue(
      new Set(['F_th_0.99', 'F_th_0.97', 'F_th_0.95'])
    );

    const adjacentStates = getAdjacentPlotStates(baseState);
    
    // Should include two alternative rules
    const ruleStates = Array.from(adjacentStates)
      .filter(s => s.rule !== baseState.rule);
    expect(ruleStates).toHaveLength(2);
    expect(ruleStates.map(s => s.rule)).toEqual(['F_th_0.97', 'F_th_0.95']);
  });

  it('should not include rules when only one is available', () => {
    vi.mocked(getAvailableRules).mockReturnValue(new Set(['F_th_0.99']));

    const adjacentStates = getAdjacentPlotStates(baseState);
    
    // Should not include any rule changes
    expect(Array.from(adjacentStates).every(s => s.rule === baseState.rule)).toBe(true);
  });
}); 