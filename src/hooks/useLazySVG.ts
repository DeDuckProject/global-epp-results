
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

    // For now, we'll use a placeholder since the actual SVGs aren't uploaded yet
    const loadMockSVG = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (signal.aborted) return;

        // Create a mock SVG
        const mockSVG = `
          <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grad1)" opacity="0.1"/>
            <text x="50%" y="30%" dominant-baseline="middle" text-anchor="middle" fill="#1e40af" font-family="Arial, sans-serif" font-size="18" font-weight="bold">
              ${path.includes('3d') ? '3D Global Schedule Plot' : 
                path.includes('best') ? 'Best Strategies 2D Plot' : 
                path.includes('distance') ? 'Distance Ratio Analysis' :
                path.includes('advantage') ? 'Advantage Heatmap' :
                path.includes('plateau') ? 'Plateau Grid Visualization' :
                path.includes('threshold') ? 'Threshold Analysis' :
                'Simulation Plot'}
            </text>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#64748b" font-family="Arial, sans-serif" font-size="14">
              Mock visualization - SVGs will be loaded here
            </text>
            <text x="50%" y="70%" dominant-baseline="middle" text-anchor="middle" fill="#64748b" font-family="Arial, sans-serif" font-size="12">
              Path: ${path}
            </text>
            <circle cx="100" cy="150" r="20" fill="#3b82f6" opacity="0.6">
              <animate attributeName="r" values="15;25;15" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="500" cy="250" r="15" fill="#1e40af" opacity="0.8">
              <animate attributeName="cy" values="250;150;250" dur="3s" repeatCount="indefinite"/>
            </circle>
          </svg>
        `;

        const blob = new Blob([mockSVG], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
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

    loadMockSVG();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [path]);

  return { svgUrl, isLoading, error };
};
