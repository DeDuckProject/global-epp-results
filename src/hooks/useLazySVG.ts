import { useState, useEffect, useRef } from 'react';

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

    // Check cache first
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
        const res = await fetch(path, { signal });
        if (!res.ok) {
          throw new Error(`Failed to load plot: ${res.status} ${res.statusText}`);
        }
        
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        
        if (signal.aborted) {
          URL.revokeObjectURL(url);
          return;
        }

        svgCache.set(path, url);
        setSvgUrl(url);
        setIsLoading(false);
      } catch (err) {
        if (!signal.aborted) {
          setError(err as Error);
          setIsLoading(false);
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
