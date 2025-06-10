
import { useState, useEffect, useRef } from 'react';

export const useThrottledState = <T>(
  initialValue: T,
  delay: number = 150
): [T, T, (value: T) => void] => {
  const [immediateValue, setImmediateValue] = useState<T>(initialValue);
  const [throttledValue, setThrottledValue] = useState<T>(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setValue = (value: T) => {
    setImmediateValue(value);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setThrottledValue(value);
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [immediateValue, throttledValue, setValue];
};
