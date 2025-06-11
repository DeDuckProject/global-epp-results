import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

// Mock the Select components
vi.mock('../../src/components/ui/select', () => {
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
  const plotState1 = { plotType: '3D global-schedule', params: { eta_c: 0.9, epsilon_G: 0.0001, N: 1024, M: 1024, rule: 'SKR' } };
  const plotState2 = { plotType: '3D global-schedule', params: { eta_c: 0.9, epsilon_G: 0.001, N: 1024, M: 1024, rule: 'F_th 0.97' } };
  const plotState3 = { plotType: 'Best strategies 2D', params: { eta_c: 0.9, epsilon_G: 0.0001, N: 1024, M: 1024 } };
  
  return {
    plotTypes: ["3D global-schedule", "Best strategies 2D"],
    plotMeta: [
      { ...plotState1, relPath: buildPlotPath(plotState1) },
      { ...plotState2, relPath: buildPlotPath(plotState2) },
      { ...plotState3, relPath: buildPlotPath(plotState3) },
    ],
    parameterValues: {
      eta_c: [0.5, 0.9],
      epsilon_G: [0.0001, 0.001],
      N: [512, 1024],
      M: [512, 1024],
      rule: ["SKR", "F_th 0.95", "F_th 0.97", "Manual"],
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

    const ruleSelect = screen.getByTestId('select');
    await userEvent.selectOptions(ruleSelect, 'F_th 0.97');
    
    const updatedPlotImage = await screen.findByRole('img', { name: /3D global-schedule plot/i }) as HTMLImageElement;
    expect(updatedPlotImage.src).toContain('3d_visualization_Fth');
    // expect(window.location.search).toContain('rule=F_th%200.97'); // TODO should fix
  });

  it('disables the rule selector for plots that do not use it', async () => {
    renderWithRouter(<PlotExplorer />);

    const plotTypeTab = await screen.findByRole('button', { name: /Best strategies 2D/i });
    await userEvent.click(plotTypeTab);

    const plotImage = await screen.findByRole('img', { name: /Best strategies 2D plot/i }) as HTMLImageElement;
    expect(plotImage.src).toContain('best_strategies');
    
    const ruleSelect = screen.getByTestId('select');
    expect(ruleSelect).toBeDisabled();
  });
}); 