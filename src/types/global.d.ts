export {}
declare global {
  interface Set<T> {
    intersection(set: Set<T>): Set<T>
  }
}
