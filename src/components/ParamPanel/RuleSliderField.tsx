import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useId } from 'react';

interface RuleSliderFieldProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
  availableOptions?: Set<string>;
}

export const RuleSliderField: React.FC<RuleSliderFieldProps> = ({
  label,
  value,
  options,
  onChange,
  disabled = false,
  availableOptions,
}) => {
  const id = useId();

  const displayOptions = availableOptions
    ? options.filter(opt => availableOptions.has(opt))
    : options;
  
  const currentIndex = displayOptions.indexOf(value);

  const handleSliderChange = (sliderValues: number[]) => {
    const newIndex = sliderValues[0];
    if (newIndex >= 0 && newIndex < displayOptions.length) {
      onChange(displayOptions[newIndex]);
    }
  };

  const isSliderDisabled = disabled || displayOptions.length <= 1;

  return (
    <div className={cn("space-y-3", isSliderDisabled && "opacity-50")}>
      <div className="flex items-center justify-between">
        <Label id={id} className={cn("text-sm font-medium", isSliderDisabled && "text-muted-foreground")}>
          {label}
          {isSliderDisabled && " 🔒"}
        </Label>
        <span className="text-sm text-muted-foreground font-mono">
          {value}
        </span>
      </div>
      
      <Slider
        aria-labelledby={id}
        aria-valuetext={value}
        value={[currentIndex]}
        onValueChange={handleSliderChange}
        max={displayOptions.length - 1}
        min={0}
        step={1}
        disabled={isSliderDisabled}
        className="w-full"
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{displayOptions[0]}</span>
        <span>{displayOptions[displayOptions.length - 1]}</span>
      </div>
    </div>
  );
}; 