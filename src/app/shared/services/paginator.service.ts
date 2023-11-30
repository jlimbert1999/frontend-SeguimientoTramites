import { Injectable, computed, signal } from '@angular/core';
interface PaginationParams {
  pageIndex: number;
  pageSize: number;
}
@Injectable({
  providedIn: 'root',
})
export class PaginatorService<T=void> {
  private pageSize = signal<number>(10);
  private pageIndex = signal<number>(0);
  private dataLength = signal<number>(0);
  private pageOffset = computed<number>(() => this.pageIndex() * this.pageSize());

  public searchMode: boolean = false;
  public searchParams = new Map<string, string>();
  public cacheStore: Record<string, any[]> = {};
  public cache: Record<string, any> = {};

  set setPage({ pageIndex, pageSize }: PaginationParams) {
    this.pageSize.set(pageSize);
    this.pageIndex.set(pageIndex);
  }

  resetPagination() {
    this.pageIndex.set(0);
    this.pageSize.set(10);
    this.dataLength.set(0);
    this.searchMode = false;
  }

  resetSearchParams() {
    if (this.searchMode) return;
    this.searchParams.clear();
    this.cacheStore = {};
  }

  set offset(value: number) {
    this.pageIndex.set(value);
  }
  set length(value: number) {
    this.dataLength.set(value);
  }

  get limit() {
    return this.pageSize();
  }
  get offset() {
    return this.pageOffset();
  }
  get index() {
    return this.pageIndex();
  }
  get length() {
    return this.dataLength();
  }

  saveSearchParams(data: Object): void {
    const validParams = Object.entries(data).reduce(
      (acc, [key, value]) => (value ? { ...acc, [key]: value } : acc),
      {}
    );
    this.searchParams = new Map(Object.entries(validParams));
  }

  get isSearchMode(): boolean {
    if (!this.searchMode || this.searchParams.size === 0) return false;
    return true;
  }
}
