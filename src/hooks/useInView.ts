import { useEffect, useRef, useState, type RefObject } from 'react';

/** Adaptador DOM: indica si el elemento está (o ha estado, con `once`) en viewport. */
export function useInView<T extends Element>(
  options: { rootMargin?: string; once?: boolean } = {},
): [RefObject<T | null>, boolean] {
  const { rootMargin = '0px', once = false } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) io.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, once]);

  return [ref, inView];
}
