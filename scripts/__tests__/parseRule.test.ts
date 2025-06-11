import { describe, it, expect } from 'vitest';
import { parseRule, PARAMETER_VALUES } from '../generatePlotMeta';

describe('parseRule', () => {
  it('parses SKR correctly', () => {
    expect(parseRule('SKR')).toBe('SKR');
  });

  it('parses Fth token as F_th 0.97', () => {
    expect(parseRule('Fth')).toBe('F_th 0.97');
  });

  it('parses F_th_0.95 correctly', () => {
    expect(parseRule('F_th_0.95')).toBe('F_th 0.95');
  });

  it('parses F_th_0.97 correctly', () => {
    expect(parseRule('F_th_0.97')).toBe('F_th 0.97');
  });

  it('parses new F_th values correctly', () => {
    expect(parseRule('F_th_0.85')).toBe('F_th 0.85');
    expect(parseRule('F_th_0.9')).toBe('F_th 0.9');
    expect(parseRule('F_th_0.99')).toBe('F_th 0.99');
  });

  it('returns undefined for unknown formats', () => {
    expect(parseRule('unknown')).toBeUndefined();
    expect(parseRule('F_th')).toBeUndefined();
    expect(parseRule('F_th_')).toBeUndefined();
    expect(parseRule('F_th_1')).toBeUndefined();
    expect(parseRule('F_th_0.96')).toBeUndefined(); // Not in PARAMETER_VALUES
  });

  it('only returns values from PARAMETER_VALUES.rule', () => {
    const result = parseRule('F_th_0.95');
    expect(PARAMETER_VALUES.rule).toContain(result);
  });
}); 