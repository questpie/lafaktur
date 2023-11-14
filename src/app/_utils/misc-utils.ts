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
