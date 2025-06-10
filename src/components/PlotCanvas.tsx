
import React, { Suspense } from 'react';
import { PlotState } from './PlotExplorer';
import { useLazySVG } from '@/hooks/useLazySVG';
import { buildPlotPath } from '@/utils/pathBuilder';

interface PlotCanvasProps {
  plotState: PlotState;
}

const PlotImage: React.FC<{ plotState: PlotState }> = ({ plotState }) => {
  const plotPath = buildPlotPath(plotState);
  const { svgUrl, isLoading, error } = useLazySVG(plotPath);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-muted rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-muted rounded-lg">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">Unable to load plot</p>
          <p className="text-sm text-muted-foreground">Path: {plotPath}</p>
        </div>
      </div>
    );
  }

  if (!svgUrl) {
    return (
      <div className="flex items-center justify-center h-full bg-muted rounded-lg">
        <div className="text-center">
          <p className="text-muted-foreground">No plot available for current parameters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-card-foreground mb-2">
          {plotState.currentPlotType}
        </h2>
        <p className="text-sm text-muted-foreground">
          η_c={plotState.eta_c}, ε_G={plotState.epsilon_g}, N={plotState.n}, M={plotState.m}, Rule={plotState.rule}
        </p>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <img 
          src={svgUrl} 
          alt={`${plotState.currentPlotType} plot`}
          className="max-w-full max-h-full object-contain"
          title={`${plotState.currentPlotType} - η_c: ${plotState.eta_c}, ε_G: ${plotState.epsilon_g}, N: ${plotState.n}, M: ${plotState.m}, Rule: ${plotState.rule}`}
        />
      </div>
    </div>
  );
};

export const PlotCanvas: React.FC<PlotCanvasProps> = ({ plotState }) => {
  return (
    <div className="h-full">
      <Suspense fallback={
        <div className="flex items-center justify-center h-full bg-muted rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }>
        <PlotImage plotState={plotState} />
      </Suspense>
    </div>
  );
};
