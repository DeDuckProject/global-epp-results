import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PlotTypeTabsProps {
  plotTypes: string[];
  currentPlotType: string;
  onPlotTypeChange: (plotType: string) => void;
}

export const PlotTypeTabs: React.FC<PlotTypeTabsProps> = ({
  plotTypes,
  currentPlotType,
  onPlotTypeChange
}) => {
  return (
    <div className="bg-card rounded-lg border p-4 shadow-sm">
      <h3 className="font-semibold text-card-foreground mb-4">Plot Types</h3>
      
      {/* Dropdown for mobile */}
      <div className="md:hidden">
        <Select value={currentPlotType} onValueChange={onPlotTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {plotTypes.map((plotType) => (
              <SelectItem key={plotType} value={plotType}>
                {plotType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Buttons for larger screens */}
      <div className="hidden md:block space-y-2">
        {plotTypes.map((plotType) => (
          <Button
            key={plotType}
            variant={currentPlotType === plotType ? "default" : "ghost"}
            className={cn(
              "w-full justify-start text-left font-normal",
              currentPlotType === plotType && "bg-primary text-primary-foreground"
            )}
            onClick={() => onPlotTypeChange(plotType)}
          >
            <span className="truncate">{plotType}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
