import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SliderField } from '../../../src/components/ParamPanel/SliderField';
import '@testing-library/jest-dom';

// Mock the Slider component
vi.mock('@/components/ui/slider', () => ({
  Slider: (props: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { value, onValueChange, ...rest } = props;
    return <input type="range" {...rest} />;
  }
}));

describe('SliderField', () => {
  const mockOnChange = vi.fn();

  const getCurrentValueElement = () => screen.getByRole('main').querySelector('.text-sm.text-muted-foreground.font-mono');

  it('formats with default precision for floating point values', () => {
    render(
      <main>
        <SliderField
          label="Epsilon G"
          value={0.0001}
          values={[0.0001, 0.001]}
          onChange={mockOnChange}
        />
      </main>
    );
    expect(getCurrentValueElement()).toHaveTextContent('0.0001');
  });

  it('formats with default precision, taking the max of 3 and actual', () => {
    render(
      <main>
        <SliderField
          label="Epsilon G"
          value={0.01}
          values={[0.001, 0.01]}
          onChange={mockOnChange}
        />
      </main>
    );
    expect(getCurrentValueElement()).toHaveTextContent('0.010');
  });

  it('formats with specified decimalPlaces', () => {
    render(
      <main>
        <SliderField
          label="Eta C"
          value={0.9}
          values={[0.3, 0.5, 0.9, 1]}
          onChange={mockOnChange}
          decimalPlaces={1}
        />
      </main>
    );
    expect(getCurrentValueElement()).toHaveTextContent('0.9');
    expect(screen.getByText('1.0')).toBeInTheDocument();
    expect(screen.getByText('0.3')).toBeInTheDocument();
  });

  it('formats integers correctly when isInteger is true', () => {
    render(
      <main>
        <SliderField
          label="Network Size"
          value={128}
          values={[4, 8, 16, 32, 64, 128]}
          onChange={mockOnChange}
          isInteger
        />
      </main>
    );
    expect(getCurrentValueElement()).toHaveTextContent('128');
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('shows min and max values formatted correctly', () => {
    render(
      <main>
        <SliderField
          label="Test"
          value={0.555}
          values={[0.1, 0.555, 0.9999]}
          onChange={mockOnChange}
        />
      </main>
    );
    // min and max
    expect(screen.getByText('0.100')).toBeInTheDocument();
    expect(screen.getByText('0.9999')).toBeInTheDocument();
    // current value
    expect(getCurrentValueElement()).toHaveTextContent('0.555');
  });
}); 