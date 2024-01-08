// use debounce

import { useEffect, useMemo, useState } from "react";

export type DebouncedFunction<T extends (...args: any[]) => any> = ((
  ...args: Parameters<T>
) => void) & {
  cancel: () => void;
};

export function debounce<TFn extends (...args: any[]) => any>(
  fn: TFn,
  delay: number,
): DebouncedFunction<TFn> {
  let timeoutID: ReturnType<typeof setTimeout> | null = null;

  function newFn(...args: any[]) {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }

    timeoutID = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      fn(...args);
      timeoutID = null;
    }, delay);
  }

  newFn.cancel = () => {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
  };

  return newFn as unknown as DebouncedFunction<TFn>;
}

export function useDebounce<TFn extends (...args: any[]) => any>(
  fn: TFn,
  delay: number,
): DebouncedFunction<TFn> {
  const debouncedFn = useMemo(() => debounce(fn, delay), [fn, delay]);
  useEffect(() => () => debouncedFn.cancel(), [debouncedFn]);
  return debouncedFn;
}

export function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
