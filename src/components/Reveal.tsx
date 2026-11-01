import { useEffect, useState, type ElementType, type ReactNode } from 'react';
import { useInView } from '../hooks/useInView';

interface Props {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** Retardo escalonado en ms (se aplica vía custom property, no valor mágico en CSS). */
  delay?: number;
}

/** Revela su contenido una sola vez al entrar en viewport. */
export function Reveal({ as: Tag = 'div', className = '', children, delay = 0 }: Props) {
  const [ref, inView] = useInView<HTMLElement>({ rootMargin: '0px 0px -12% 0px', once: true });
  const [ready, setReady] = useState(false);
  // Sin IntersectionObserver (o antes de hidratar) el contenido debe ser visible.
  useEffect(() => setReady(typeof IntersectionObserver !== 'undefined'), []);
  const visible = !ready || inView;
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
