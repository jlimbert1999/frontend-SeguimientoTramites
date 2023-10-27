import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { PaginatorService } from '../../services/paginator.service';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnInit, OnDestroy {
  @Input('pageSizeOptions') pageSizeOptions: number[] = [];
  @Output('page') page: EventEmitter<undefined> = new EventEmitter();

  constructor(private paginatorService: PaginatorService) {}

  ngOnInit(): void {
    this.paginatorService.resetSearchParams();
  }
  ngOnDestroy(): void {
    this.paginatorService.resetPagination();
  }

  setPage({ pageIndex, pageSize }: PageEvent) {
    this.paginatorService.setPage = { limit: pageSize, offset: pageIndex };
    this.page.emit();
  }

  get pageIndex() {
    return this.paginatorService.offset;
  }
  get pageSize() {
    return this.paginatorService.limit;
  }
  get length() {
    return this.paginatorService.length;
  }
}
