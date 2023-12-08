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

export function isNullish(value: unknown): value is null | undefined {
  return value === null || typeof value === "undefined";
}
