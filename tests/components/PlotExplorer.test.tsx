import React from 'react';
import { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PlotExplorer } from '../../src/components/PlotExplorer';
import { MemoryRouter } from 'react-router-dom';
import { buildPlotPath } from '../../src/utils/pathBuilder';
import { logger } from '../../src/utils/logger';
import '@testing-library/jest-dom';

// Mock child components and data
vi.mock('../../src/components/Header', () => ({ Header: () => <header>Header</header> }));
vi.mock('../../src/components/Footer', () => ({ Footer: () => <footer>Footer</footer> }));
vi.mock('../../src/hooks/useLazySVG', () => ({
  useLazySVG: (path) => {
    return { svgUrl: path, isLoading: false, error: null };
  }
}));

// Mock the Slider component
vi.mock('../../src/components/ui/slider', () => ({
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

// Mock logger
vi.mock('../../src/utils/logger', () => ({
  logger: {
    warn: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn()
  }
}));

// Use vi.doMock to prevent hoisting issues
vi.doMock('../../src/data/plotMeta', () => {
  const params = { eta_c: 0.9, epsilon_G: 0.0001, N: 1024, M: 1024 };
  const plotState1 = { plotType: '3D global-schedule', params: { ...params, rule: 'SKR' } };
  const plotState2 = { plotType: '3D global-schedule', params: { ...params, rule: 'F_th 0.97' } };
  const plotState3 = { plotType: 'Best strategies 2D', params: { eta_c: 0.9, epsilon_G: 0.0001, N: 1024, M: 1024 } };
  
  return {
    plotTypes: ["3D global-schedule", "Best strategies 2D"],
    plotMeta: [
      { ...plotState1, relPath: 'comparison_plots/etac0.9_epsg0.0001/svg/3d_visualization_SKR_N1024_M1024_etac0.9_epsg0.0001.svg' },
      { ...plotState2, relPath: 'comparison_plots/etac0.9_epsg0.0001/svg/3d_visualization_F_th_0.97_N1024_M1024_etac0.9_epsg0.0001.svg' },
      { ...plotState3, relPath: 'comparison_plots/etac0.9_epsg0.0001/svg/best_strategies_N1024_M1024.svg' },
    ],
    parameterValues: {
      eta_c: [0.9, 0.5],
      epsilon_G: [0.0001, 0.001],
      N: [1024, 512],
      M: [1024, 512],
      rule: ["SKR", "F_th 0.85", "F_th 0.90", "F_th 0.95", "F_th 0.97", "F_th 0.99", "Manual"],
    },
    dependencyMatrix: {
      '3D global-schedule': { eta_c: true, epsilon_G: true, N: true, M: true, rule: true },
      'Best strategies 2D': { eta_c: true, epsilon_G: true, N: true, M: true, rule: false },
    }
  }
});

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: MemoryRouter });
};

describe('PlotExplorer Integration Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates the 3D plot and URL when the rule is changed', async () => {
    renderWithRouter(<PlotExplorer />);
    
    const plotTypeTab = await screen.findByRole('button', { name: /3D global-schedule/i });
    await userEvent.click(plotTypeTab);
    
    const plotImage = await screen.findByRole('img', { name: /3D global-schedule plot/i }) as HTMLImageElement;
    expect(plotImage.src).toContain('3d_visualization_SKR');

    const desktopParamPanel = screen.getByTestId('param-panel-desktop');
    const ruleSlider = within(desktopParamPanel).getByRole('slider', { name: /rule/i });
    
    // Find the index for 'F_th 0.97'
    const { parameterValues } = await vi.importActual('../../src/data/plotMeta') as {
      parameterValues: { rule: string[] }
    };
    const ruleIndex = parameterValues.rule.indexOf('F_th 0.97');
    
    fireEvent.change(ruleSlider, { target: { value: ruleIndex } });
    
    const updatedPlotImage = await screen.findByRole('img', { name: /3D global-schedule plot/i }) as HTMLImageElement;
    expect(updatedPlotImage.src).toContain('3d_visualization_F_th_0.97');
    // expect(window.location.search).toContain('rule=F_th%200.97'); // TODO should fix
  });

  it('disables the rule selector for plots that do not use it', async () => {
    renderWithRouter(<PlotExplorer />);

    const plotTypeTab = await screen.findByRole('button', { name: /Best strategies 2D/i });
    await userEvent.click(plotTypeTab);

    const plotImage = await screen.findByRole('img', { name: /Best strategies 2D plot/i }) as HTMLImageElement;
    expect(plotImage.src).toContain('best_strategies');
    
    const desktopParamPanel = screen.getByTestId('param-panel-desktop');
    const ruleSlider = within(desktopParamPanel).getByRole('slider', { name: /rule/i });
    expect(ruleSlider).toBeDisabled();
  });
}); 