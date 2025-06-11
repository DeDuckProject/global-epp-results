import React, { Suspense, useRef } from 'react';
import { PlotState } from '@/types/PlotState';
import { useLazySVG } from '@/hooks/useLazySVG';
import { buildPlotPath } from '@/utils/pathBuilder';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { usePersistentTransform } from '@/hooks/usePersistentTransform';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface PlotCanvasProps {
  plotState: PlotState;
}

const PlotImage: React.FC<{ plotState: PlotState }> = ({ plotState }) => {
  const plotPath = buildPlotPath(plotState);
  const { svgUrl, isLoading, error } = useLazySVG(plotPath);
  const { transformState, onTransformed, resetTransform } = usePersistentTransform();
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

  const isDefaultView =
    transformState.scale === 1 &&
    transformState.positionX === 0 &&
    transformState.positionY === 0;

  const handleZoomIn = () => {
    if (transformRef.current) {
      transformRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (transformRef.current) {
      transformRef.current.zoomOut();
    }
  };

  const handleReset = () => {
    resetTransform(transformRef);
  };

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
    <div className="bg-white rounded-lg border shadow-sm p-4 h-full flex flex-col relative">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-card-foreground mb-2">
          {plotState.currentPlotType}
        </h2>
        <p className="text-sm text-muted-foreground">
          η_c={plotState.eta_c}, ε_G={plotState.epsilon_G}, N={plotState.N}, M={plotState.M}, Rule={plotState.rule}
        </p>
      </div>
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom In">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom Out">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleReset} title="Reset View" disabled={isDefaultView}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 flex items-center justify-center cursor-grab active:cursor-grabbing" style={{ overflow: 'hidden' }}>
        <TransformWrapper
          ref={transformRef}
          initialScale={transformState.scale}
          initialPositionX={transformState.positionX}
          initialPositionY={transformState.positionY}
          onTransformed={(ref, state) => onTransformed(ref, state)}
        >
          <TransformComponent
            wrapperStyle={{ width: '100%', height: '100%' }}
            contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <img 
              src={svgUrl} 
              alt={`${plotState.currentPlotType} plot`}
              className="max-w-full max-h-full object-contain"
              title={`${plotState.currentPlotType} - η_c: ${plotState.eta_c}, ε_G: ${plotState.epsilon_G}, N: ${plotState.N}, M: ${plotState.M}, Rule: ${plotState.rule}`}
            />
          </TransformComponent>
        </TransformWrapper>
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
