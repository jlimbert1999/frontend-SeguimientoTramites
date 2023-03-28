import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {
  limit: number = 10
  offset: number = 0
  length: number = 0

  // for search
  text: string = ''

  // for mails
  type: 'EXTERNO' | 'INTERNO' | undefined

  constructor(
  ) {
  }

  setPage(event: PageEvent) {
    this.limit = event.pageSize
    this.offset = event.pageIndex
  }

  resetPage() {
    this.limit = 10
    this.offset = 0
    this.length = 0
    this.text = ''
    this.type = undefined
  }



}
