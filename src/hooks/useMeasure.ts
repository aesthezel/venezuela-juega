import { useState, useLayoutEffect, useCallback, useRef } from 'preact/hooks';

/**
 * Simple hook to measure an element's width (and other dimensions if needed).
 */
export function useMeasure<T extends HTMLElement>() {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const ref = useRef<T>(null);

  const measure = useCallback(() => {
    if (ref.current) {
      setRect(ref.current.getBoundingClientRect());
    }
  }, []);

  useLayoutEffect(() => {
    if (!ref.current) return;

    measure();

    const observer = new ResizeObserver(() => measure());
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [measure]);

  return { ref, rect, width: rect?.width ?? 0, height: rect?.height ?? 0 };
}
