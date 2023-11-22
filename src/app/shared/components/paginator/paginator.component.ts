import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { PaginatorService } from '../../services/paginator.service';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnInit, OnDestroy {
  @Input({ required: true }) set pageSizeOptions(options: number[]) {
    this.paginatorService.limit = options[0] ?? 10;
    this.pageOptions = options;
  }
  @Output('page') page: EventEmitter<undefined> = new EventEmitter();
  public pageOptions: number[] = [];

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
