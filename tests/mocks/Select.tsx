import React from 'react';

// Mock the Select components
export const Select = ({ value, onValueChange, children }: any) => (
  <select
    value={value}
    onChange={(e) => onValueChange?.(e.target.value)}
    data-testid="select"
  >
    {children}
  </select>
);

export const SelectTrigger = ({ children }: any) => <div>{children}</div>;
export const SelectValue = ({ children }: any) => <span>{children}</span>;
export const SelectContent = ({ children }: any) => <div role="listbox">{children}</div>;
export const SelectItem = ({ value, children }: any) => (
  <option role="option" value={value}>
    {children}
  </option>
); 