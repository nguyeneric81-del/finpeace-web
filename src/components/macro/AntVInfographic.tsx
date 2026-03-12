'use client';

import { useEffect, useRef } from 'react';

interface AntVInfographicProps {
  syntax: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function AntVInfographic({
  syntax,
  width = 800,
  height = 400,
  className = '',
}: AntVInfographicProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;

    import('@antv/infographic').then(({ Infographic }) => {
      if (!mounted || !containerRef.current) return;

      // Clean up previous instance if any
      if (instanceRef.current) {
        try { instanceRef.current.destroy?.(); } catch {}
      }

      // Clear container
      containerRef.current.innerHTML = '';

      instanceRef.current = new Infographic({
        container: containerRef.current,
        width,
        height,
        padding: 20,
        editable: false,
      });

      instanceRef.current.render(syntax);
    });

    return () => {
      mounted = false;
      if (instanceRef.current) {
        try { instanceRef.current.destroy?.(); } catch {}
      }
    };
  }, [syntax, width, height]);

  return (
    <div
      ref={containerRef}
      className={`w-full rounded-2xl overflow-hidden ${className}`}
    />
  );
}
