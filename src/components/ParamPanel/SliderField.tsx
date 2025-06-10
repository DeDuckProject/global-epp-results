
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface SliderFieldProps {
  label: string;
  value: number;
  values: number[];
  onChange: (value: number) => void;
  disabled?: boolean;
  step?: number;
  isInteger?: boolean;
}

export const SliderField: React.FC<SliderFieldProps> = ({
  label,
  value,
  values,
  onChange,
  disabled = false,
  isInteger = false
}) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const currentIndex = values.indexOf(value);

  const handleSliderChange = (sliderValues: number[]) => {
    const newIndex = sliderValues[0];
    if (newIndex >= 0 && newIndex < values.length) {
      onChange(values[newIndex]);
    }
  };

  return (
    <div className={cn("space-y-3", disabled && "opacity-50")}>
      <div className="flex items-center justify-between">
        <Label className={cn("text-sm font-medium", disabled && "text-muted-foreground")}>
          {label}
          {disabled && " 🔒"}
        </Label>
        <span className="text-sm text-muted-foreground font-mono">
          {isInteger ? value : value.toFixed(3)}
        </span>
      </div>
      
      <Slider
        value={[currentIndex]}
        onValueChange={handleSliderChange}
        max={values.length - 1}
        min={0}
        step={1}
        disabled={disabled}
        className="w-full"
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{isInteger ? min : min.toFixed(3)}</span>
        <span>{isInteger ? max : max.toFixed(3)}</span>
      </div>
    </div>
  );
};
