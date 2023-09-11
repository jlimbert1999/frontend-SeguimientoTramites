import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { PaginatorService } from '../../services/paginator.service';

@Component({
  selector: 'app-input-search-procedures',
  templateUrl: './input-search-procedures.component.html',
  styleUrls: ['./input-search-procedures.component.scss'],
})
export class InputSearchProceduresComponent implements OnInit, OnDestroy {
  @Input() value = '';
  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  debounceTime = 1000;
  @Output() searchEvent = new EventEmitter<string>();
  constructor() {}
  ngOnInit(): void {
    this.subscription = this.modelChanged
      .pipe(debounceTime(this.debounceTime))
      .subscribe(() => {
        this.functionToBeCalled();
      });
  }

  functionToBeCalled() {
    this.searchEvent.emit(this.value);
  }

  inputChanged() {
    this.modelChanged.next(this.value);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
