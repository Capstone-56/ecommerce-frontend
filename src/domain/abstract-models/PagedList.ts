/** Corresponding PagedList model from backend (built upon a customised DRF's pagination model) */
export interface PagedList<T> {
  count: number,
  pageSize: number,
  next: string,
  previous: string,
  results: Array<T>
}
