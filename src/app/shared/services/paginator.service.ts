import { Injectable } from '@angular/core';
interface paginationParams {
  limit: number;
  offset: number;
}
@Injectable({
  providedIn: 'root',
})
export class PaginatorService {
  public limit = 10;
  public offset: number = 0;
  public length: number = 0;
  public searchMode: boolean = false;
  public searchParams = new Map<string, string>();
  public cacheStore: Record<string, any[]> = {};

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
    if (this.searchMode) return;
    this.searchParams.clear();
    this.cacheStore = {};
  }

  get isSearchMode(): boolean {
    if (!this.searchMode || this.searchParams.size === 0) return false;
    return true;
  }
}
