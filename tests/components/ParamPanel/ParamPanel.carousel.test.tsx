import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ParamPanel } from '../../../src/components/ParamPanel/ParamPanel';
import { PlotState } from '../../../src/types/PlotState';
import '@testing-library/jest-dom';

const scrollPrev = vi.fn();
const scrollNext = vi.fn();

vi.mock('embla-carousel-react', () => ({
  default: () => [vi.fn(), { scrollPrev, scrollNext, canScrollPrev: () => true, canScrollNext: () => true, on: vi.fn(), off: vi.fn(), emit: vi.fn(), slideNodes: () => [], selectedScrollSnap: () => 0 }],
}));

vi.mock('../../../src/data/plotMeta', () => ({
  parameterValues: {
    eta_c: [0.3, 0.5, 0.7, 0.9, 1.0],
    epsilon_G: [0.0001, 0.0005, 0.001],
    N: [512, 1024, 2048],
    M: [512, 1024, 2048],
    rule: ["SKR", "F_th 0.97"]
  },
  plotMeta: [],
  dependencyMatrix: {
    '3D global-schedule': { eta_c: true, epsilon_G: true, N: true, M: true, rule: false },
  }
}));

const basePlotState: PlotState = {
  currentPlotType: '3D global-schedule',
  eta_c: 0.9,
  epsilon_G: 0.001,
  N: 1024,
  M: 1024,
  rule: 'SKR'
};

const activeDependencies = { eta_c: true, epsilon_G: true, N: true, M: true, rule: true };

describe('ParamPanel Carousel', () => {

  it('navigates slides using next and previous buttons', async () => {
    const onStateChange = vi.fn();
    const scrollPrev = vi.fn();
    const scrollNext = vi.fn();
    
    // Here we need to mock the useEmblaCarousel hook to provide our own functions
    const embla = await import('embla-carousel-react');
    const useEmblaCarousel = vi.spyOn(embla, 'default');
    useEmblaCarousel.mockReturnValue([vi.fn(), { 
      scrollPrev, 
      scrollNext,
      canScrollNext: () => true,
      canScrollPrev: () => true,
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
      slideNodes: () => [],
      selectedScrollSnap: () => 0,
    } as any]);

    render(
      <ParamPanel
        plotState={basePlotState}
        activeDependencies={activeDependencies}
        onStateChange={onStateChange}
      />
    );

    const mobileView = screen.getByTestId('param-panel-mobile');
    const nextButton = within(mobileView).getByTestId('carousel-next-button');
    const prevButton = within(mobileView).getByTestId('carousel-prev-button');

    const etaCSlider = screen.getAllByLabelText(/η_c/i)[0];
    const epsilonGSlider = screen.getAllByLabelText(/ε_G/i)[0];

    expect(etaCSlider).toBeVisible();
    
    await userEvent.click(nextButton);
    expect(scrollNext).toHaveBeenCalled();

    await userEvent.click(prevButton);
    expect(scrollPrev).toHaveBeenCalled();
  });

  it('has pointer-events disabled on the carousel track', () => {
    const onStateChange = vi.fn();
    render(
      <ParamPanel
        plotState={basePlotState}
        activeDependencies={activeDependencies}
        onStateChange={onStateChange}
      />
    );
    
    const mobileView = screen.getByTestId('param-panel-mobile');
    const track = mobileView.querySelector('.flex.pointer-events-none');
    
    expect(track).toHaveClass('pointer-events-none');
  });
}); 