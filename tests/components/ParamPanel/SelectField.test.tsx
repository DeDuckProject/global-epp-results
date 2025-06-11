import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SelectField } from '../../../src/components/ParamPanel/SelectField';
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

describe('SelectField - Option Filtering', () => {
  it('shows all options when availableOptions is not provided', async () => {
    render(
      <SelectField
        label="Test Select"
        value="A"
        options={["A", "B", "C"]}
        onChange={() => {}}
      />
    );

    const select = screen.getByTestId('select');
    await userEvent.click(select);

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('A');
    expect(options[1]).toHaveTextContent('B');
    expect(options[2]).toHaveTextContent('C');
  });

  it('filters options based on availableOptions set', async () => {
    render(
      <SelectField
        label="Test Select"
        value="A"
        options={["A", "B", "C"]}
        onChange={() => {}}
        availableOptions={new Set(["A", "C"])}
      />
    );

    const select = screen.getByTestId('select');
    await userEvent.click(select);

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent('A');
    expect(options[1]).toHaveTextContent('C');
  });

  it('disables the select when disabled prop is true', () => {
    render(
      <SelectField
        label="Test Select"
        value="A"
        options={["A", "B", "C"]}
        onChange={() => {}}
        disabled={true}
      />
    );

    const select = screen.getByTestId('select');
    expect(select).toBeDisabled();
  });

  it('updates visible options when availableOptions changes', async () => {
    const { rerender } = render(
      <SelectField
        label="Test Select"
        value="A"
        options={["A", "B", "C"]}
        onChange={() => {}}
        availableOptions={new Set(["A", "B"])}
      />
    );

    let options = screen.getAllByRole('option');
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent('A');
    expect(options[1]).toHaveTextContent('B');

    rerender(
      <SelectField
        label="Test Select"
        value="A"
        options={["A", "B", "C"]}
        onChange={() => {}}
        availableOptions={new Set(["B", "C"])}
      />
    );

    options = screen.getAllByRole('option');
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent('B');
    expect(options[1]).toHaveTextContent('C');
  });
});