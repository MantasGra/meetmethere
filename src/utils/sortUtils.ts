export const compareAsc = (lhs: number, rhs: number) => lhs - rhs;

export const getComparerByGetter =
  <T, V>(valueGetter: (obj: T) => V, compareFn: (a: V, b: V) => number) =>
  (a: T, b: T) =>
    compareFn(valueGetter(a), valueGetter(b));
