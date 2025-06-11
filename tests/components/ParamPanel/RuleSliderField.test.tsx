import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RuleSliderField } from '@/components/ParamPanel/RuleSliderField';
import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';
import { within } from '@testing-library/dom';

// We are mocking the Slider component to isolate the RuleSliderField component and avoid testing implementation details of the Slider.
// This allows us to control the slider's behavior and assert that RuleSliderField passes the correct props.
vi.mock('@/components/ui/slider', () => ({
  Slider: ({
    value,
    onValueChange,
    disabled,
    max,
    'aria-labelledby': ariaLabelledby,
  }: {
    value: number[];
    onValueChange: (value: number[]) => void;
    disabled?: boolean;
    max: number;
    'aria-labelledby': string;
  }) => (
    <input
      type="range"
      min="0"
      max={max}
      value={value[0]}
      disabled={disabled}
      onChange={e => onValueChange([parseInt(e.target.value, 10)])}
      data-testid="slider"
      aria-labelledby={ariaLabelledby}
    />
  ),
}));

describe('RuleSliderField', () => {
  const defaultProps = {
    label: 'Test Rule',
    value: 'Option 2',
    options: ['Option 1', 'Option 2', 'Option 3'],
    onChange: vi.fn(),
    disabled: false,
  };

  it('renders correctly with basic props', () => {
    render(<RuleSliderField {...defaultProps} />);

    expect(screen.getByLabelText('Test Rule')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();

    const slider = screen.getByTestId('slider');
    expect(slider).toBeInTheDocument();
    expect(slider).not.toBeDisabled();
    expect(slider).toHaveAttribute('max', '2');
    expect(slider).toHaveValue('1');

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('calls onChange with the correct value when slider changes', async () => {
    const onChange = vi.fn();
    render(<RuleSliderField {...defaultProps} onChange={onChange} />);

    const slider = screen.getByTestId('slider');
    
    // Fire a change event to simulate the user moving the slider.
    fireEvent.change(slider, { target: { value: '2' } });
    expect(onChange).toHaveBeenCalledWith('Option 3');
    
    fireEvent.change(slider, { target: { value: '0' } });
    expect(onChange).toHaveBeenCalledWith('Option 1');
  });

  it('disables the slider when disabled prop is true', () => {
    render(<RuleSliderField {...defaultProps} disabled={true} />);

    const slider = screen.getByTestId('slider');
    expect(slider).toBeDisabled();
    expect(screen.getByText('Test Rule 🔒')).toBeInTheDocument();
  });

  it('disables the slider when there is only one option', () => {
    render(
      <RuleSliderField
        {...defaultProps}
        options={['Option 1']}
        value="Option 1"
      />
    );

    const slider = screen.getByTestId('slider');
    expect(slider).toBeDisabled();
    expect(screen.getByText('Test Rule 🔒')).toBeInTheDocument();
  });

  it('filters options based on availableOptions', () => {
    const availableOptions = new Set(['Option 1', 'Option 3']);
    render(
      <RuleSliderField
        {...defaultProps}
        value="Option 1"
        availableOptions={availableOptions}
      />
    );

    const slider = screen.getByTestId('slider');
    expect(slider).toHaveAttribute('max', '1');
    expect(slider).toHaveValue('0');

    // The current value is displayed in a span with a specific class.
    const valueSpan = screen.getByText(defaultProps.label).nextElementSibling;
    expect(valueSpan).toHaveTextContent('Option 1');

    // The range labels are in a separate container.
    const rangeLabelsContainer = slider.nextElementSibling;
    expect(within(rangeLabelsContainer as HTMLElement).getByText('Option 1')).toBeInTheDocument();
    expect(within(rangeLabelsContainer as HTMLElement).getByText('Option 3')).toBeInTheDocument();

    expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
  });

  it('disables the slider when filtered options are less than or equal to 1', () => {
    const availableOptions = new Set(['Option 1']);
    render(
      <RuleSliderField
        {...defaultProps}
        value="Option 1"
        availableOptions={availableOptions}
      />
    );

    const slider = screen.getByTestId('slider');
    expect(slider).toBeDisabled();
    expect(screen.getByText('Test Rule 🔒')).toBeInTheDocument();
  });

  it('is accessible', () => {
    render(<RuleSliderField {...defaultProps} />);
    const slider = screen.getByTestId('slider');
    const label = screen.getByText(defaultProps.label);

    expect(slider).toHaveAttribute('aria-labelledby', label.id);
  });
}); 