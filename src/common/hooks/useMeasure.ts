import { useState, useLayoutEffect, useRef } from 'preact/hooks';

/**
 * Optimized hook to measure an element's dimensions using ResizeObserver.
 * Avoids synchronous getBoundingClientRect() to prevent layout thrashing.
 * Batches updates and skips redundant re-renders when dimensions have not changed.
 */
export function useMeasure<T extends HTMLElement>() {
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const ref = useRef<T>(null);
  const lastDimensions = useRef({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries || !entries.length) return;
      const cr = entries[0].contentRect;
      const roundedW = Math.round(cr.width);
      const roundedH = Math.round(cr.height);

      if (
        Math.abs(roundedW - lastDimensions.current.width) > 1 ||
        Math.abs(roundedH - lastDimensions.current.height) > 1
      ) {
        lastDimensions.current = { width: roundedW, height: roundedH };
        setDimensions({ width: roundedW, height: roundedH });
      }
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return {
    ref,
    rect: null,
    width: dimensions.width,
    height: dimensions.height,
  };
}
