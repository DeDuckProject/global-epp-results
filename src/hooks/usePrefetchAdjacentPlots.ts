import { useEffect, useRef } from 'react';
import { PlotState } from '@/types/PlotState';
import { buildPlotPath } from '@/utils/pathBuilder';
import { getAdjacentPlotStates } from '@/utils/getAdjacentPlotStates';
import { logger } from '@/utils/logger';

const MAX_CONCURRENT_PREFETCH = 6;

/**
 * Prefetches SVG plots that are "adjacent" to the current plot state.
 * Only runs when shouldRun is true (i.e., after the current plot is loaded).
 */
export function usePrefetchAdjacentPlots(plotState: PlotState, shouldRun: boolean) {
  const prefetchQueueRef = useRef<Set<string>>(new Set());
  const activePrefetchesRef = useRef<number>(0);

  useEffect(() => {
    if (!shouldRun) return;

    const adjacentStates = getAdjacentPlotStates(plotState);
    const urls = Array.from(adjacentStates).map(state => buildPlotPath(state));

    // Add new URLs to the queue
    urls.forEach(url => prefetchQueueRef.current.add(url));

    const processPrefetchQueue = async () => {
      // If we're at max concurrent prefetches, wait
      if (activePrefetchesRef.current >= MAX_CONCURRENT_PREFETCH) return;

      // Get next URL from queue
      const url = prefetchQueueRef.current.values().next().value;
      if (!url) return;

      // Remove from queue and increment active count
      prefetchQueueRef.current.delete(url);
      activePrefetchesRef.current++;

      try {
        logger.debug('Prefetching SVG', { url });
        await fetch(url, { cache: 'force-cache' });
      } catch (error) {
        logger.error('Failed to prefetch SVG', { url, error });
      } finally {
        activePrefetchesRef.current--;
        // Process next item if there are any left
        if (prefetchQueueRef.current.size > 0) {
          processPrefetchQueue();
        }
      }
    };

    // Start processing the queue
    while (activePrefetchesRef.current < MAX_CONCURRENT_PREFETCH && 
           prefetchQueueRef.current.size > 0) {
      processPrefetchQueue();
    }

  }, [plotState, shouldRun]);
} 