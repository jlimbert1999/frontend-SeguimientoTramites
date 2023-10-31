import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { matSelectSearchData } from '../../interfaces';

@Component({
  selector: 'app-simple-mat-select-search',
  templateUrl: './simple-mat-select-search.component.html',
  styleUrls: ['./simple-mat-select-search.component.scss'],
})
export class SimpleMatSelectSearchComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input({ required: true }) data: matSelectSearchData[] = [];
  @Input() placehorder: string = 'Seleccione';
  @Input() isRequired: boolean;
  @Input() allowNullValue: boolean = false;
  @Output() eventSelectedOption: EventEmitter<string> = new EventEmitter();

  ngOnChanges(): void {
    this.filteredBanks.next(this.data.slice());
  }

  public bankCtrl: FormControl = new FormControl('');
  public bankFilterCtrl: FormControl = new FormControl();
  public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('singleSelect') singleSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  ngAfterViewInit(): void {
    if (this.isRequired) this.bankCtrl.addValidators(Validators.required);
    this.bankCtrl.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.filteredBanks.next(this.data.slice());
    this.bankFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterBanks();
    });
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterBanks() {
    if (!this.data) {
      return;
    }
    let search = this.bankFilterCtrl.value;
    if (!search) {
      this.filteredBanks.next(this.data.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredBanks.next(this.data.filter((element) => element.text.toLowerCase().indexOf(search) > -1));
  }

  selectOption(selectedValue: string) {
    this.eventSelectedOption.emit(selectedValue);
  }

  accessToPropertyObject(path: string, object: any) {
    if (path === '') return object;
    return path.split('.').reduce((o, i) => o[i], object);
  }
}
