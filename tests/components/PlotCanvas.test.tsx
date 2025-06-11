import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlotCanvas } from '@/components/PlotCanvas';
import { PlotState } from '@/types/PlotState';
import { useLazySVG } from '@/hooks/useLazySVG';
import { usePersistentTransform } from '@/hooks/usePersistentTransform';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/hooks/useLazySVG');
vi.mock('@/hooks/usePersistentTransform');

const mockUseLazySVG = useLazySVG as vi.Mock;
const mockUsePersistentTransform = usePersistentTransform as vi.Mock;

const mockZoomIn = vi.fn();
const mockZoomOut = vi.fn();
const mockHookResetTransform = vi.fn();

vi.mock('react-zoom-pan-pinch', () => ({
    TransformWrapper: React.forwardRef((props: any, ref: any) => {
        if (ref) {
            ref.current = {
                zoomIn: mockZoomIn,
                zoomOut: mockZoomOut,
            };
        }
        return <div>{props.children}</div>;
    }),
    TransformComponent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('PlotCanvas', () => {
    const initialPlotState: PlotState = {
        currentPlotType: 'Type A',
        eta_c: 0.1,
        epsilon_G: 0.2,
        N: 10,
        M: 20,
        rule: 'Rule 1',
    };

    beforeEach(() => {
        mockUseLazySVG.mockReturnValue({
            svgUrl: 'fake-svg-url.svg',
            isLoading: false,
            error: null,
        });
        vi.clearAllMocks();
        mockUsePersistentTransform.mockClear();
    });

    it('renders the plot image and controls', () => {
        mockUsePersistentTransform.mockReturnValue({
            transformState: { scale: 1, positionX: 0, positionY: 0 },
            onTransformed: vi.fn(),
            resetTransform: vi.fn(),
        });
        render(<PlotCanvas plotState={initialPlotState} />);
        expect(screen.getByAltText('Type A plot')).toBeInTheDocument();
        expect(screen.getByTitle('Zoom In')).toBeInTheDocument();
        expect(screen.getByTitle('Zoom Out')).toBeInTheDocument();
        expect(screen.getByTitle('Reset View')).toBeInTheDocument();
    });

    it('calls zoom in when zoom in button is clicked', () => {
        mockUsePersistentTransform.mockReturnValue({
            transformState: { scale: 1, positionX: 0, positionY: 0 },
            onTransformed: vi.fn(),
            resetTransform: vi.fn(),
        });
        render(<PlotCanvas plotState={initialPlotState} />);
        fireEvent.click(screen.getByTitle('Zoom In'));
        expect(mockZoomIn).toHaveBeenCalled();
    });

    it('calls zoom out when zoom out button is clicked', () => {
        mockUsePersistentTransform.mockReturnValue({
            transformState: { scale: 1, positionX: 0, positionY: 0 },
            onTransformed: vi.fn(),
            resetTransform: vi.fn(),
        });
        render(<PlotCanvas plotState={initialPlotState} />);
        fireEvent.click(screen.getByTitle('Zoom Out'));
        expect(mockZoomOut).toHaveBeenCalled();
    });

    it('should have persistent zoom/pan state when plot changes', async () => {
        mockUsePersistentTransform.mockReturnValue({
            transformState: { scale: 1, positionX: 0, positionY: 0 },
            onTransformed: vi.fn(),
            resetTransform: vi.fn(),
        });
        const { rerender } = render(<PlotCanvas plotState={initialPlotState} />);
        
        const zoomInButton = screen.getByTitle('Zoom In');
        fireEvent.click(zoomInButton);

        mockUsePersistentTransform.mockReturnValue({
            transformState: { scale: 2, positionX: 10, positionY: 10 },
            onTransformed: vi.fn(),
            resetTransform: mockHookResetTransform,
        });

        const newPlotState: PlotState = { ...initialPlotState, currentPlotType: 'Type B' };
        
        mockUseLazySVG.mockReturnValue({
            svgUrl: 'new-fake-svg-url.svg',
            isLoading: false,
            error: null,
        });

        rerender(<PlotCanvas plotState={newPlotState} />);
        
        expect(screen.getByAltText('Type B plot')).toBeInTheDocument();
    });
}); 