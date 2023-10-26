import { Injectable } from '@angular/core';
interface paginationParams {
  limit: number;
  offset: number;
}
@Injectable({
  providedIn: 'root',
})
export class PaginatorService {
  public limit: number = 10;
  public offset: number = 0;
  public length: number = 0;
  public searchMode: boolean = false;
  public searchParams = new Map<string, string>();

  constructor() {}

  set setPage({ limit, offset }: paginationParams) {
    this.limit = limit;
    this.offset = offset;
  }

  resetPagination() {
    this.limit = 10;
    this.offset = 0;
    this.length = 0;
    this.searchMode = false;
  }

  resetSearchParams() {
    if (!this.searchMode) {
      this.searchParams.clear();
    }
  }
}
