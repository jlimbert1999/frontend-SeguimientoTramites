import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject, debounceTime, filter, takeUntil, tap } from 'rxjs';
import { MatSelectSearchData } from '../../interfaces';

@Component({
  selector: 'app-server-mat-select-search',
  templateUrl: './server-mat-select-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerMatSelectSearchComponent<T> {
  @Input() placeholder: string = 'Filtrar informacion';
  @Input({ required: true }) set options(values: MatSelectSearchData<T>[]) {
    this.filteredServerSideOptions.next(values);
  }
  @Input() set currentOption(value: T | null) {
    this.optionServerSideCtrl.setValue(value);
  }
  @Output() keyupEvent: EventEmitter<string> = new EventEmitter();
  @Output() selectEvent: EventEmitter<T> = new EventEmitter();

  public optionServerSideCtrl: FormControl = new FormControl();
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
        debounceTime(300)
      )
      .subscribe(
        (value: string) => {
          this.searching = false;
          this.keyupEvent.emit(value);
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
    this.selectEvent.emit(data);
  }
}
