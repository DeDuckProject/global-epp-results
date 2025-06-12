import { useState, useEffect, useRef } from 'react';
import { logger } from '@/utils/logger';

interface UseLazySVGResult {
  svgUrl: string | null;
  isLoading: boolean;
  error: Error | null;
}

const svgCache = new Map<string, string>();

export const useLazySVG = (path: string): UseLazySVGResult => {
  const [svgUrl, setSvgUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Check in-memory cache first
    if (svgCache.has(path)) {
      setSvgUrl(svgCache.get(path)!);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setIsLoading(true);
    setError(null);

    const loadFile = async () => {
      try {
        // First try to load directly - this will use HTTP cache if available
        const res = await fetch(path, { 
          signal,
          cache: 'force-cache' // Prefer cached version
        });
        
        if (!res.ok) {
          throw new Error(`Failed to load plot: ${res.status} ${res.statusText}`);
        }

        // If we got here, we have the SVG content
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        if (signal.aborted) {
          URL.revokeObjectURL(url);
          return;
        }

        // Cache the blob URL for future use
        svgCache.set(path, url);
        setSvgUrl(url);
        setIsLoading(false);

        logger.debug('SVG loaded', { 
          path, 
          fromCache: res.headers.get('x-from-cache') === 'true',
          size: blob.size
        });
      } catch (err) {
        if (!signal.aborted) {
          setError(err as Error);
          setIsLoading(false);
          logger.error('Failed to load SVG', { path, error: err });
        }
      }
    };

    loadFile();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [path]);

  return { svgUrl, isLoading, error };
};
