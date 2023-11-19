export function invariant(
  condition: any,
  message: string,
  context?: string,
): asserts condition {
  if (!condition) {
    throw new Error(
      `Invariant violation: ${message} ${context ? `(${context})` : ""}`,
    );
  }
}

export function roundTo(num: number, decimals: number): number {
  return Math.round(num * 10 ** decimals) / 10 ** decimals;
}

/**
 * Just a type-safe helper for Array.includes
 */
export function isIncludedIn<const T, const U extends readonly T[]>(
  value: T,
  array: U,
): value is U[number] {
  return array.includes(value);
}
