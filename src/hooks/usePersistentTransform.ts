import { useState, useCallback } from 'react';
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

export interface TransformState {
  scale: number;
  positionX: number;
  positionY: number;
}

const initialTransformState: TransformState = {
  scale: 1,
  positionX: 0,
  positionY: 0,
};

let storedTransformState: TransformState = initialTransformState;

export const usePersistentTransform = () => {
  const [transformState, setTransformState] = useState<TransformState>(storedTransformState);

  const onTransformed = (ref: ReactZoomPanPinchRef, state: TransformState) => {
    storedTransformState = state;
    setTransformState(state);
  };
  
  const resetTransform = (ref:  React.RefObject<ReactZoomPanPinchRef>) => {
    if (ref.current) {
        ref.current.setTransform(0, 0, 1);
        storedTransformState = initialTransformState;
        setTransformState(initialTransformState);
    }
  };

  return {
    transformState,
    onTransformed,
    resetTransform,
  };
}; 