import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ParamPanel } from '../../../src/components/ParamPanel/ParamPanel';
import { PlotState } from '../../../src/types/PlotState';
import '@testing-library/jest-dom';

// Mock child components to isolate ParamPanel
vi.mock('../../../src/components/ParamPanel/SliderField', () => ({
  SliderField: (props: { label: string; decimalPlaces?: number }) => (
    <div>
      <span>{props.label}</span>
      <span data-testid={`decimal-places-${props.label}`}>{String(props.decimalPlaces)}</span>
    </div>
  )
}));

vi.mock('../../../src/components/ParamPanel/SelectField', () => ({
  SelectField: ({ label }: { label: string }) => (
    <div>{label}</div>
  )
}));


describe('ParamPanel - Prop Passing', () => {
  const mockOnStateChange = vi.fn();

  const basePlotState: PlotState = {
    currentPlotType: '3D global-schedule',
    eta_c: 0.9,
    epsilon_G: 0.001,
    N: 1024,
    M: 1024,
    rule: 'SKR'
  };

  const activeDependencies = {
    eta_c: true,
    epsilon_G: true,
    N: true,
    M: true,
    rule: true
  };

  it('passes correct decimalPlaces prop to SliderField components', () => {
    render(
      <ParamPanel
        plotState={basePlotState}
        activeDependencies={activeDependencies}
        onStateChange={mockOnStateChange}
      />
    );

    // Check eta_c SliderField for correct decimalPlaces
    const etaCSlider = screen.getByTestId('decimal-places-η_c (BSA Coupling Efficiency)');
    expect(etaCSlider).toHaveTextContent('1');

    // Check epsilon_G SliderField for correct (undefined) decimalPlaces
    const epsilonGSlider = screen.getByTestId('decimal-places-ε_G (Gate Error Rate)');
    expect(epsilonGSlider).toHaveTextContent('undefined');
  });
}); 