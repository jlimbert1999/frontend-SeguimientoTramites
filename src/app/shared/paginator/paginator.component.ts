import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PaginatorService } from '../services/paginator.service';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('pageSizeOptions') pageSizeOptions: number[] = [];
  @Output('page') page: EventEmitter<undefined> = new EventEmitter();


  constructor(public paginatorService: PaginatorService) { }

  ngAfterViewInit(): void {


  }

  ngOnInit(): void {
  }
  setPage(event: PageEvent) {
    this.paginatorService.setPage(event)
    this.page.emit();
  }

  ngOnDestroy(): void {
    this.paginatorService.resetPage()
  }

}
