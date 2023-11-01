export type WithAutocomplete<T, P = string> = T | (P & Record<never, never>);
export type StringWithAutocomplete<T> = WithAutocomplete<T>;
