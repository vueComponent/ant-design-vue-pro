declare function Omit<T, K extends keyof T>(
  obj: T,
  keys: Array<K>
): Pick<T, Exclude<keyof T, K>>;

export default Omit;
