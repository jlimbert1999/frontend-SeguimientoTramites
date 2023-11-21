import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject, debounceTime, filter, takeUntil, tap } from 'rxjs';
import { MatSelectSearchData } from '../../interfaces';

@Component({
  selector: 'app-server-mat-select-search',
  templateUrl: './server-mat-select-search.component.html',
  styleUrls: ['./server-mat-select-search.component.scss'],
})
export class ServerMatSelectSearchComponent<T> {
  @Output() searchEvent: EventEmitter<string> = new EventEmitter();
  @Output() eventSelectedOption: EventEmitter<T> = new EventEmitter();
  @Input() placeholder: string;
  @Input() allowNullValue: boolean = false;

  @Input() set options(values: MatSelectSearchData<T>[]) {
    this.filteredServerSideOptions.next(values);
  }
  public optionsServerSideCtrl: FormControl = new FormControl();
  public optionServerSideFilteringCtrl = new FormControl();
  public searching: boolean = false;
  public filteredServerSideOptions: ReplaySubject<MatSelectSearchData<T>[]> = new ReplaySubject(1);
  protected _onDestroy = new Subject<void>();

  ngOnInit() {
    this.optionServerSideFilteringCtrl.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.searching = true)),
        takeUntil(this._onDestroy),
        debounceTime(800)
      )
      .subscribe(
        (value: string) => {
          this.searching = false;
          this.searchEvent.emit(value);
        },
        () => {
          this.searching = false;
        }
      );
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  selectOption(data: T) {
    this.eventSelectedOption.emit(data);
  }
}
