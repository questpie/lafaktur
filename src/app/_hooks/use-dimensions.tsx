import { useEffect, useState, type RefObject } from "react";

export function useDimensions(ref: RefObject<HTMLElement>) {
  const [dimensions, setDimensions] = useState<DOMRect | null>(null);

  useEffect(() => {
    const node = ref.current;

    if (node) {
      setDimensions(ref.current.getBoundingClientRect());
    }

    const handleResize = () => {
      if (node) {
        setDimensions(ref.current.getBoundingClientRect());
      }
    };

    window.addEventListener("resize", handleResize);
    node?.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      node?.removeEventListener("resize", handleResize);
    };
  }, [ref]);

  return dimensions;
}
