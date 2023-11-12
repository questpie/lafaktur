export type WithAutocomplete<T, P = string> = T | (P & Record<never, never>);
export type StringWithAutocomplete<T> = WithAutocomplete<T>;

// pick the correct type from a union based on the value of a discriminant
export type FromUnion<
  TUnion,
  TDiscriminant extends keyof TUnion,
  TDiscriminantValue extends TUnion[TDiscriminant],
> = Extract<TUnion, Record<TDiscriminant, TDiscriminantValue>>;
