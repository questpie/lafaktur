export type WithAutocomplete<T, P = string> = T | (P & Record<never, never>);
export type StringWithAutocomplete<T> = WithAutocomplete<T>;

export type WithOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type WithRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

// pick the correct type from a union based on the value of a discriminant
export type FromUnion<
  TUnion,
  TDiscriminant extends keyof TUnion,
  TDiscriminantValue extends TUnion[TDiscriminant],
> = Extract<TUnion, Record<TDiscriminant, TDiscriminantValue>>;

// returns discriminated union without the variant with the given discriminant value
