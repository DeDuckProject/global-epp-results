import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ParamPanel } from '../../../src/components/ParamPanel/ParamPanel';
import { logger } from '../../../src/utils/logger';
import '@testing-library/jest-dom';

// Mock the Slider component
vi.mock('../../../src/components/ui/slider', () => ({
  Slider: ({ value, onValueChange, disabled, max, 'aria-labelledby': ariaLabelledby }: any) => (
    <input
      type="range"
      role="slider"
      min="0"
      max={max}
      value={value ? value[0] : 0}
      onChange={(e) => onValueChange?.([parseInt(e.target.value, 10)])}
      disabled={disabled}
      aria-labelledby={ariaLabelledby}
    />
  ),
}));

// Mock the logger
vi.mock('../../../src/utils/logger', () => ({
  logger: {
    warn: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn()
  }
}));

// Mock plotMeta with minimal test data
vi.mock('../../../src/data/plotMeta', () => ({
  parameterValues: {
    eta_c: [0.5, 0.9],
    epsilon_G: [0.0001, 0.001],
    N: [512, 1024],
    M: [512, 1024],
    rule: ["SKR", "F_th 0.97"]
  },
  plotMeta: [
    { plotType: '3D local vs. global schedule', params: { eta_c: 0.9, epsilon_G: 0.0001, N: 1024, M: 1024, rule: 'SKR' } },
    { plotType: '3D local vs. global schedule', params: { eta_c: 0.9, epsilon_G: 0.001, N: 1024, M: 1024, rule: 'F_th 0.97' } }
  ],
  plotTypes: ["3D local vs. global schedule", "Policy comparison"],
  dependencyMatrix: {
    '3D local vs. global schedule': { eta_c: true, epsilon_G: true, N: true, M: true, rule: true },
    'Policy comparison': { eta_c: true, epsilon_G: true, N: true, M: true, rule: false },
  }
}));

describe('ParamPanel - Rule Selection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows only the rule that matches the exact parameter set', async () => {
    const onStateChange = vi.fn();
    render(
      <ParamPanel
        plotState={{
          currentPlotType: '3D local vs. global schedule',
          eta_c: 0.9,
          epsilon_G: 0.0001,
          N: 1024,
          M: 1024,
          rule: 'SKR'
        }}
        activeDependencies={{ rule: true }}
        onStateChange={onStateChange}
      />
    );

    const desktopView = screen.getByTestId('param-panel-desktop');
    const ruleSlider = within(desktopView).getByRole('slider', { name: /rule/i });
    expect(ruleSlider).toHaveAttribute('max', '0');
  });
  
  it('updates available rules when a parameter changes', async () => {
    const onStateChange = vi.fn();
    const initialPlotState = {
      currentPlotType: '3D local vs. global schedule',
      eta_c: 0.9,
      epsilon_G: 0.0001,
      N: 1024,
      M: 1024,
      rule: 'SKR'
    };

    const { rerender } = render(
      <ParamPanel
        plotState={initialPlotState}
        activeDependencies={{ rule: true }}
        onStateChange={onStateChange}
      />
    );

    const desktopView = screen.getByTestId('param-panel-desktop');
    const ruleSlider = within(desktopView).getByRole('slider', { name: /rule/i });
    expect(ruleSlider).toHaveAttribute('max', '0');

    // Rerender with a new epsilon_G
    const updatedPlotState = { ...initialPlotState, epsilon_G: 0.001 };
    rerender(
        <ParamPanel
        plotState={updatedPlotState}
        activeDependencies={{ rule: true }}
        onStateChange={onStateChange}
      />
    );

    expect(ruleSlider).toHaveAttribute('max', '0');
    
    // Check if auto-switch was triggered
    expect(logger.warn).toHaveBeenCalled();
    expect(onStateChange).toHaveBeenCalledWith({ rule: 'F_th 0.97' });
  });

  it('disables rule selector for plots that do not use it', () => {
    render(
      <ParamPanel
        plotState={{
          currentPlotType: 'Policy comparison',
          eta_c: 0.9,
          epsilon_G: 0.0001,
          N: 1024,
          M: 1024,
          rule: 'SKR'
        }}
        activeDependencies={{ rule: false }}
        onStateChange={() => {}}
      />
    );

    const desktopView = screen.getByTestId('param-panel-desktop');
    const ruleSlider = within(desktopView).getByRole('slider', { name: /rule/i });
    expect(ruleSlider).toBeDisabled();
  });

  it('automatically switches rule when current rule is not available', async () => {
    const onStateChange = vi.fn();
    
    // This plot state has a rule 'SKR' that isn't available for epsilon_G: 0.001
    render(
      <ParamPanel
        plotState={{
          currentPlotType: '3D local vs. global schedule',
          eta_c: 0.9,
          epsilon_G: 0.001,
          N: 1024,
          M: 1024,
          rule: 'SKR'
        }}
        activeDependencies={{ rule: true }}
        onStateChange={onStateChange}
      />
    );

    // Should auto-switch to F_th 0.97 and log warning upon rendering
    expect(onStateChange).toHaveBeenCalledWith({ rule: 'F_th 0.97' });
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Selected rule "SKR" is not available with current parameters')
    );
  });
}); 