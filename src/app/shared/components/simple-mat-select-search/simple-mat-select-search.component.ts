import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-simple-mat-select-search',
  templateUrl: './simple-mat-select-search.component.html',
  styleUrls: ['./simple-mat-select-search.component.scss']
})
export class SimpleMatSelectSearchComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {


  @Input() data: any[] = []
  @Input() placehorder: string
  @Input() pathPropertyOfObjectDisplay: string
  @Output() eventSelectedOption: EventEmitter<any> = new EventEmitter();
  @Input() isRequired: boolean
  @Input() allowNullValue: boolean = false



  ngOnChanges(): void {
    this.filteredBanks.next(this.data.slice());
  }




  /** control for the selected bank */
  public bankCtrl: FormControl = new FormControl('');
  /** control for the MatSelect filter keyword */
  public bankFilterCtrl: FormControl = new FormControl();
  /** list of banks filtered by search keyword */
  public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('singleSelect') singleSelect: MatSelect;
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  ngAfterViewInit(): void {
    if (this.isRequired) this.bankCtrl.addValidators(Validators.required)
    this.bankCtrl.updateValueAndValidity()
  }


  ngOnInit(): void {
    // load the initial bank list
    this.filteredBanks.next(this.data.slice());
    // listen for search field value changes
    this.bankFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
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
    this.filteredBanks.next(
      this.data.filter(bank => this.accessToPropertyObject(this.pathPropertyOfObjectDisplay, bank).toLowerCase().indexOf(search) > -1)
    );
  }

  selectOption(data: any) {
    this.eventSelectedOption.emit(data)
  }

  accessToPropertyObject(path: string, object: any) {
    return path.split('.').reduce((o, i) => o[i], object)
  }


}
