import { useCallback, useRef } from 'react';

export default function useThrottle<T extends (...args: any[]) => any>(
  fn: T, 
  interval: number
): T {
  const lastCallTime = useRef<number>(0);
  
  const throttledFn = useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    
    if (now - lastCallTime.current >= interval) {
      lastCallTime.current = now;
      return fn(...args);
    }
  }, [fn, interval]);
  
  return throttledFn as T;
}