import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  AfterViewInit,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { PaginatorService } from '../../services/paginator.service';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent implements OnInit, AfterViewInit, OnDestroy {
  public pageOptions = signal<number[]>([10, 20, 30, 50]);
  @Output() changePage: EventEmitter<void> = new EventEmitter();
  constructor(private readonly paginatorService: PaginatorService) {}

  ngOnInit(): void {
    this.paginatorService.emptyCache();
  }
  ngAfterViewInit(): void {
    this.restoreScrollItem();
  }

  ngOnDestroy(): void {
    this.paginatorService.resetPagination();
  }

  onPageChange({ pageIndex, pageSize }: PageEvent) {
    this.paginatorService.setPage = { pageSize: pageSize, pageIndex: pageIndex };
    this.changePage.emit();
  }

  get pageIndex() {
    return this.paginatorService.index;
  }
  get pageSize() {
    return this.paginatorService.limit;
  }
  get dataLength() {
    return this.paginatorService.length;
  }

  private restoreScrollItem(): void {
    const itemId = sessionStorage.getItem('scrollItemId');
    if (!this.paginatorService.keepAliveData || !itemId) return;
    const element = document.getElementById(itemId);
    if (!element) return;
    element.scrollIntoView({
      behavior: 'instant',
      block: 'center',
      inline: 'nearest',
    });
  }
}
