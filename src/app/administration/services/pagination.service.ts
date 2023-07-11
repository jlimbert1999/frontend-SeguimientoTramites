import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  public pageIndex: number = 0
  public rows: number = 10
  public dataSize: number = 0

  constructor() { }
}
