import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useId } from 'react';

interface SliderFieldProps {
  label: string;
  value: number;
  values: number[];
  onChange: (value: number) => void;
  disabled?: boolean;
  step?: number;
  isInteger?: boolean;
  decimalPlaces?: number;
}

export const SliderField: React.FC<SliderFieldProps> = ({
  label,
  value,
  values,
  onChange,
  disabled = false,
  isInteger = false,
  decimalPlaces
}) => {
  const id = useId();
  const min = Math.min(...values);
  const max = Math.max(...values);
  const currentIndex = values.indexOf(value);

  const handleSliderChange = (sliderValues: number[]) => {
    const newIndex = sliderValues[0];
    if (newIndex >= 0 && newIndex < values.length) {
      onChange(values[newIndex]);
    }
  };

  const formatValue = (num: number) => {
    if (isInteger) {
      return num.toString();
    }
    if (decimalPlaces !== undefined) {
      return num.toFixed(decimalPlaces);
    }
    
    const s = num.toString();
    const actualDecimalCount = s.includes('.') ? s.split('.')[1].length : 0;
    return num.toFixed(Math.max(3, actualDecimalCount));
  };

  return (
    <div className={cn("space-y-3", disabled && "opacity-50")}>
      <div className="flex items-center justify-between">
        <Label id={id} className={cn("text-sm font-medium", disabled && "text-muted-foreground")}>
          {label}
          {disabled && " 🔒"}
        </Label>
        <span className="text-sm text-muted-foreground font-mono">
          {formatValue(value)}
        </span>
      </div>
      
      <Slider
        aria-labelledby={id}
        value={[currentIndex]}
        onValueChange={handleSliderChange}
        max={values.length - 1}
        min={0}
        step={1}
        disabled={disabled}
        className="w-full"
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
};
