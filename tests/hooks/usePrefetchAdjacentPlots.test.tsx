import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePrefetchAdjacentPlots } from '@/hooks/usePrefetchAdjacentPlots';
import { getAdjacentPlotStates } from '@/utils/getAdjacentPlotStates';
import { buildPlotPath } from '@/utils/pathBuilder';
import { logger } from '@/utils/logger';
import { PlotState } from '@/types/PlotState';

// Mock dependencies
vi.mock('@/utils/getAdjacentPlotStates', () => ({
  getAdjacentPlotStates: vi.fn()
}));

vi.mock('@/utils/pathBuilder', () => ({
  buildPlotPath: vi.fn()
}));

vi.mock('@/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn()
  }
}));

describe('usePrefetchAdjacentPlots', () => {
  const mockPlotState = {
    currentPlotType: '3D+global-schedule',
    eta_c: 0.3,
    epsilon_G: 0.0001,
    N: 256,
    M: 2048,
    rule: 'F_th_0.99'
  };

  const mockAdjacentStates = new Set([
    { ...mockPlotState, eta_c: 0.5 },
    { ...mockPlotState, N: 512 }
  ]);

  const mockUrls = [
    '/plots/plot1.svg',
    '/plots/plot2.svg'
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    
    // Setup mocks
    vi.mocked(getAdjacentPlotStates).mockReturnValue(mockAdjacentStates);
    vi.mocked(buildPlotPath).mockImplementation((state: PlotState) => 
      mockUrls[Array.from(mockAdjacentStates).findIndex(s => s === state)]
    );
    
    // Mock fetch
    global.fetch = vi.fn().mockImplementation(() => 
      Promise.resolve(new Response())
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not prefetch when shouldRun is false', () => {
    renderHook(() => usePrefetchAdjacentPlots(mockPlotState, false));
    
    expect(getAdjacentPlotStates).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should prefetch adjacent plots when shouldRun is true', async () => {
    renderHook(() => usePrefetchAdjacentPlots(mockPlotState, true));
    
    expect(getAdjacentPlotStates).toHaveBeenCalledWith(mockPlotState);
    
    // Wait for all promises to resolve
    await vi.runAllTimersAsync();
    
    // Should attempt to fetch all URLs
    mockUrls.forEach(url => {
      expect(global.fetch).toHaveBeenCalledWith(url, { cache: 'force-cache' });
      expect(logger.debug).toHaveBeenCalledWith('Prefetching SVG', { url });
    });
  });

  it('should handle fetch errors gracefully', async () => {
    const error = new Error('Network error');
    global.fetch = vi.fn().mockRejectedValue(error);

    renderHook(() => usePrefetchAdjacentPlots(mockPlotState, true));
    
    // Wait for all promises to resolve
    await vi.runAllTimersAsync();
    
    // Should log errors but not throw
    mockUrls.forEach(url => {
      expect(logger.error).toHaveBeenCalledWith('Failed to prefetch SVG', { url, error });
    });
  });

  it('should respect MAX_CONCURRENT_PREFETCH limit', async () => {
    // Create more adjacent states than MAX_CONCURRENT_PREFETCH
    const manyStates = Array.from({ length: 10 }, (_, i) => ({ 
      ...mockPlotState, 
      N: mockPlotState.N + i * 128 
    }));
    const manyUrls = manyStates.map((_, i) => `/plots/plot${i}.svg`);
    
    vi.mocked(getAdjacentPlotStates).mockReturnValue(new Set(manyStates));
    vi.mocked(buildPlotPath).mockImplementation((state: PlotState) => 
      manyUrls[manyStates.findIndex(s => s === state)]
    );

    // Mock fetch to return a promise that we control
    const fetchPromises: Promise<Response>[] = [];
    global.fetch = vi.fn().mockImplementation(() => {
      const promise = new Promise<Response>((resolve) => {
        setTimeout(() => resolve(new Response()), 1000);
      });
      fetchPromises.push(promise);
      return promise;
    });
    
    renderHook(() => usePrefetchAdjacentPlots(mockPlotState, true));
    
    // Advance timers to start all fetches
    await vi.advanceTimersByTimeAsync(0);
    
    // Should not have more than MAX_CONCURRENT_PREFETCH active at once
    expect(global.fetch).toHaveBeenCalledTimes(6); // MAX_CONCURRENT_PREFETCH = 6

    // Complete first batch of fetches
    await vi.advanceTimersByTimeAsync(1000);

    // Should start fetching the remaining URLs
    expect(global.fetch).toHaveBeenCalledTimes(10); // All URLs should be fetched eventually
  });
}); 