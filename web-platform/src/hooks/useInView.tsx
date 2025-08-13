import { useCallback, useEffect, useState } from "react";

export const useInView = <T extends HTMLElement = HTMLElement>(
  options: {
    once?: boolean;
    threshold?: number;
    rootMargin?: string;
  } = {},
) => {
  const [isInView, setIsInView] = useState(false);
  const [node, setNode] = useState<T | null>(null);

  const ref = useCallback((node: T | null) => {
    setNode(node);
  }, []);

  useEffect(() => {
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);

        if (options.once && entry.isIntersecting) {
          observer.disconnect();
        }
      },
      {
        threshold: options.threshold ?? 0.1,
        rootMargin: options.rootMargin || "0px",
      },
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
    };
  }, [node, options.once, options.threshold, options.rootMargin]);

  return { ref, isInView };
};
