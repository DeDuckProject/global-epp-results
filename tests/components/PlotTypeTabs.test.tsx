import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PlotTypeTabs } from '../../src/components/PlotTypeTabs';
import '@testing-library/jest-dom';
import React from 'react';

describe('PlotTypeTabs', () => {
  const plotTypes = ['Type A', 'Type B', 'Type C'];
  const currentPlotType = 'Type A';
  const onPlotTypeChange = vi.fn();

  it('renders buttons for plot types on desktop', () => {
    render(
      <PlotTypeTabs
        plotTypes={plotTypes}
        currentPlotType={currentPlotType}
        onPlotTypeChange={onPlotTypeChange}
      />
    );

    // The buttons are hidden on mobile, but should be in the DOM
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(plotTypes.length);
    expect(buttons[0]).toHaveTextContent('Type A');
  });

  it('renders a select dropdown for plot types on mobile', () => {
    render(
      <PlotTypeTabs
        plotTypes={plotTypes}
        currentPlotType={currentPlotType}
        onPlotTypeChange={onPlotTypeChange}
      />
    );
    
    // The select is for mobile, but should be in the DOM
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    // Check for the text content of the trigger, not the value of the select
    expect(select).toHaveTextContent(currentPlotType);
  });
}); 