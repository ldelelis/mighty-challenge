export class PaginatedResponse<T> {
  readonly count: number;
  readonly data: T[];

  constructor(count: number, data: T[]) {
    this.count = count;
    this.data = data;
  }
}
