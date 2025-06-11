import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface SelectFieldProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
  availableOptions?: Set<string>;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  options,
  onChange,
  disabled = false,
  availableOptions,
}) => {
  // Filter options if availableOptions is provided
  const displayOptions = availableOptions 
    ? options.filter(opt => availableOptions.has(opt))
    : options;

  const labelId = `${label.toLowerCase().replace(/\s+/g, '-')}-label`;

  return (
    <div className={cn("space-y-3", disabled && "opacity-50")}>
      <Label 
        htmlFor={labelId}
        className={cn("text-sm font-medium", disabled && "text-muted-foreground")}
      >
        {label}
        {disabled && " 🔒"}
      </Label>
      
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled || displayOptions.length === 0}
      >
        <SelectTrigger 
          id={labelId}
          className="w-full"
          aria-labelledby={labelId}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {displayOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
