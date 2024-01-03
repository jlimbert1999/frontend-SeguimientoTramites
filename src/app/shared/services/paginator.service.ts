import { Injectable, computed, signal } from '@angular/core';
import { PaginationParameters } from '../interfaces';
interface PaginationOptions {
  pageIndex: number;
  pageSize: number;
}
@Injectable({
  providedIn: 'root',
})
export class PaginatorService {
  private pageSize = signal<number>(10);
  private pageIndex = signal<number>(0);
  private dataLength = signal<number>(0);
  private pageOffset = computed<number>(() => this.pageIndex() * this.pageSize());

  public searchMode = signal<boolean>(false);
  public cache: Record<string, any> = {};

  set setPage({ pageIndex, pageSize }: PaginationOptions) {
    this.pageSize.set(pageSize);
    this.pageIndex.set(pageIndex);
  }

  resetPagination() {
    this.pageSize.set(10);
    this.pageIndex.set(0);
    this.dataLength.set(0);
    this.searchMode.set(false);
  }

  emptyCache() {
    if (this.searchMode()) return;
    this.cache = {};
  }

  set offset(value: number) {
    this.pageIndex.set(value);
  }
  set length(value: number) {
    this.dataLength.set(value);
  }
  set limit(value: number) {
    this.pageSize.set(value);
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

  get isSearchMode(): boolean {
    if (!this.searchMode() || Object.keys(this.cache).length === 0) return false;
    return true;
  }

  get PaginationParams(): PaginationParameters {
    return { limit: this.pageSize(), offset: this.pageOffset() };
  }
}
