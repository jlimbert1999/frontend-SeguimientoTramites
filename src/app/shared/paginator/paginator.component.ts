import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {

  @Input('length') length: number;
  @Input('pageSize') pageSize: number;
  @Input('pageSizeOptions') pageSizeOptions: number[];

  @Output('page') page: EventEmitter<PageEvent> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    console.log(this.length)
    console.log(this.pageSize)
  }
  setPage(event: PageEvent) {
    this.page.emit(event);
  }

}
