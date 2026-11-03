import { useCallback, useEffect, useRef } from 'react';

interface Options {
  onReachEnd: () => void;
  /** False once there is nothing left to fetch, or while a fetch is in flight. */
  enabled: boolean;
  /** Fetch this far before the sentinel is actually visible. */
  rootMargin?: string;
}

/**
 * Returns a ref to attach to the element that should trigger the next page.
 *
 * A callback ref rather than an object ref: the sentinel unmounts whenever the list
 * switches to its loading, empty or error branch, and a callback ref re-observes the new
 * node automatically. An object ref inside an effect would need the whole query object in
 * its dependencies and would rebuild the observer on every render.
 */
export function useScrollSentinel({
  onReachEnd,
  enabled,
  rootMargin = '240px',
}: Options): (node: HTMLElement | null) => void {
  const observer = useRef<IntersectionObserver | null>(null);
  const handler = useRef(onReachEnd);

  useEffect(() => {
    handler.current = onReachEnd;
  }, [onReachEnd]);

  useEffect(() => {
    return () => {
      observer.current?.disconnect();
    };
  }, []);

  return useCallback(
    (node: HTMLElement | null) => {
      observer.current?.disconnect();

      if (node === null || !enabled) {
        return;
      }

      // Observing fires immediately when the node is already in view, which is what loads
      // page two when the first page is shorter than the viewport.
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting === true) {
            handler.current();
          }
        },
        { rootMargin },
      );

      observer.current.observe(node);
    },
    [enabled, rootMargin],
  );
}
