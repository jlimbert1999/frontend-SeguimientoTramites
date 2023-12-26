import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
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
export class PaginatorComponent implements OnInit, OnDestroy {
  public pageOptions = signal<number[]>([10, 25, 30, 50]);
  @Input({ required: true }) set pageSizeOptions(options: number[]) {
    this.paginatorService.limit = options[0] ?? 10;
    this.pageOptions.set(options);
  }
  @Output() changePage: EventEmitter<void> = new EventEmitter();
  constructor(private readonly paginatorService: PaginatorService) {}

  ngOnInit(): void {
    console.log('reset from paginator componet');
    this.paginatorService.resetSearchParams();
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
}
