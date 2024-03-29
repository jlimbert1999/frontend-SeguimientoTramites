import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ReplaySubject, Subject, debounceTime, filter, takeUntil, tap } from 'rxjs';
import { MatSelectSearchData } from '../../interfaces';

@Component({
  selector: 'app-server-mat-select-search',
  templateUrl: './server-mat-select-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerMatSelectSearchComponent<T> {
  @Input() placeholder: string = 'Buscar informacion';
  @Input({ required: true }) set options(values: MatSelectSearchData<T>[]) {
    this.filteredServerSideOptions.next(values);
  }
  @Input() set currentOption(value: T | undefined) {
    this.optionServerSideCtrl.setValue(value);
  }
  @Output() keyupEvent: EventEmitter<string> = new EventEmitter();
  @Output() selectEvent: EventEmitter<T> = new EventEmitter();

  public optionServerSideCtrl = new FormControl<T | undefined>(undefined);
  public optionServerSideFilteringCtrl = new FormControl<string>('', Validators.pattern(/^[a-zA-Z0-9\s.]+$/));
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
        (value) => {
          this.searching = false;
          if (this.optionServerSideFilteringCtrl.invalid) return;
          this.keyupEvent.emit(value!);
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
