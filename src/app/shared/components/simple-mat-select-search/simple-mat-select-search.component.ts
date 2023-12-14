import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { MatSelectSearchData } from '../../interfaces';

@Component({
  selector: 'simple-mat-select-search',
  templateUrl: './simple-mat-select-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleMatSelectSearchComponent<T> {
  @Input() placehorder: string = 'Seleccione una opcion';
  @Input() required: boolean = false;
  @Input({ required: true }) set options(values: MatSelectSearchData<T>[]) {
    this.data = values;
    this.filteredOptions.next(values);
  }
  @Input() set currentOption(value: T | null) {
    this.optionCtrl.setValue(value);
  }
  @Output() selectEvent: EventEmitter<T> = new EventEmitter();

  public data: MatSelectSearchData<T>[] = [];
  public optionCtrl: FormControl = new FormControl('', [Validators.required]);
  public optionFilterCtrl: FormControl = new FormControl();
  public filteredOptions: ReplaySubject<MatSelectSearchData<T>[]> = new ReplaySubject(1);
  protected _onDestroy = new Subject<void>();

  ngOnInit(): void {
    this.optionFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterOptions();
    });
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterOptions() {
    if (!this.data) {
      return;
    }
    let search = this.optionFilterCtrl.value;
    if (!search) {
      this.filteredOptions.next(this.data.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredOptions.next(this.data.filter((element) => element.text.toLowerCase().indexOf(search) > -1));
  }

  selectOption(value: T) {
    this.selectEvent.emit(value);
  }
}
