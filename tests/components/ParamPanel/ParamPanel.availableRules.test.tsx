import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ParamPanel } from '../../../src/components/ParamPanel/ParamPanel';
import { logger } from '../../../src/utils/logger';
import '@testing-library/jest-dom';

// Mock the Select components
vi.mock('../../../src/components/ui/select', () => {
  const SelectContent = ({ children }: any) => children;
  const SelectItem = ({ value, children }: any) => <option value={value}>{children}</option>;

  const Select = ({ value, onValueChange, disabled, children }: any) => (
    <select
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      data-testid="select"
      disabled={disabled}
    >
      {children}
    </select>
  );

  const SelectTrigger = ({ children }: any) => children;
  const SelectValue = ({ children }: any) => children;

  return { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
});

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
    { plotType: '3D global-schedule', params: { eta_c: 0.9, epsilon_G: 0.0001, N: 1024, M: 1024, rule: 'SKR' } },
    { plotType: '3D global-schedule', params: { eta_c: 0.9, epsilon_G: 0.001, N: 1024, M: 1024, rule: 'F_th 0.97' } }
  ],
  plotTypes: ["3D global-schedule", "Best strategies 2D"],
  dependencyMatrix: {
    '3D global-schedule': { eta_c: true, epsilon_G: true, N: true, M: true, rule: true },
    'Best strategies 2D': { eta_c: true, epsilon_G: true, N: true, M: true, rule: false },
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
          currentPlotType: '3D global-schedule',
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

    const select = screen.getByTestId('select');
    await userEvent.click(select);

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('SKR');
  });
  
  it('updates available rules when a parameter changes', async () => {
    const onStateChange = vi.fn();
    const initialPlotState = {
      currentPlotType: '3D global-schedule',
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

    let options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('SKR');

    // Rerender with a new epsilon_G
    const updatedPlotState = { ...initialPlotState, epsilon_G: 0.001 };
    rerender(
        <ParamPanel
        plotState={updatedPlotState}
        activeDependencies={{ rule: true }}
        onStateChange={onStateChange}
      />
    );

    options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('F_th 0.97');
    
    // Check if auto-switch was triggered
    expect(logger.warn).toHaveBeenCalled();
    expect(onStateChange).toHaveBeenCalledWith({ rule: 'F_th 0.97' });
  });

  it('disables rule selector for plots that do not use it', () => {
    render(
      <ParamPanel
        plotState={{
          currentPlotType: 'Best strategies 2D',
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

    const select = screen.getByTestId('select');
    expect(select).toBeDisabled();
  });

  it('automatically switches rule when current rule is not available', async () => {
    const onStateChange = vi.fn();
    render(
      <ParamPanel
        plotState={{
          currentPlotType: '3D global-schedule',
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

    // Change epsilon_G to 0.001 which should only allow F_th 0.97
    const select = screen.getByTestId('select');
    await userEvent.click(select);

    const fthOption = screen.getByRole('option', { name: 'F_th 0.97' });
    await userEvent.click(fthOption);

    // Should auto-switch to F_th 0.97 and log warning
    expect(onStateChange).toHaveBeenCalledWith({ rule: 'F_th 0.97' });
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Selected rule "SKR" is not available with current parameters')
    );
  });
}); 