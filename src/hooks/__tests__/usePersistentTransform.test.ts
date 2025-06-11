import { renderHook, act } from '@testing-library/react';
import { usePersistentTransform, TransformState } from '../usePersistentTransform';
import { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { createRef } from 'react';
import { describe, it, expect } from 'vitest';


describe('usePersistentTransform', () => {
    it('should return initial transform state', () => {
        const { result } = renderHook(() => usePersistentTransform());

        expect(result.current.transformState).toEqual({
            scale: 1,
            positionX: 0,
            positionY: 0,
        });
    });

    it('should update transform state when onTransformed is called', () => {
        const { result } = renderHook(() => usePersistentTransform());
        const mockRef = {} as ReactZoomPanPinchRef;
        const newState: TransformState = {
            scale: 2,
            positionX: 10,
            positionY: 20,
        };

        act(() => {
            result.current.onTransformed(mockRef, newState);
        });

        expect(result.current.transformState).toEqual(newState);
    });

    it('should reset transform state when resetTransform is called', () => {
        const { result } = renderHook(() => usePersistentTransform());
        const mockRef = createRef<ReactZoomPanPinchRef>();
        
        (mockRef as any).current = {
            setTransform: () => {},
        };


        const newState: TransformState = {
            scale: 2,
            positionX: 10,
            positionY: 20,
        };

        act(() => {
            result.current.onTransformed({} as ReactZoomPanPinchRef, newState);
        });

        expect(result.current.transformState).toEqual(newState);

        act(() => {
            result.current.resetTransform(mockRef);
        });
        
        expect(result.current.transformState).toEqual({
            scale: 1,
            positionX: 0,
            positionY: 0,
        });
    });

    it('should persist state between hook instances', () => {
        const { result: result1 } = renderHook(() => usePersistentTransform());
        const newState: TransformState = {
            scale: 1.5,
            positionX: 50,
            positionY: -50,
        };

        act(() => {
            result1.current.onTransformed({} as ReactZoomPanPinchRef, newState);
        });

        const { result: result2 } = renderHook(() => usePersistentTransform());
        expect(result2.current.transformState).toEqual(newState);

        // Reset for other tests
        const mockRef = createRef<ReactZoomPanPinchRef>();
        (mockRef as any).current = {
            setTransform: () => {}
        };
        act(() => {
            result2.current.resetTransform(mockRef);
        });
    });
}); 