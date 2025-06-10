
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
      <div className="space-y-2">
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
