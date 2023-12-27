import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { PaginatorService } from 'src/app/shared/services';

@Component({
  selector: 'app-input-search-procedures',
  templateUrl: './input-search-procedures.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule],
})
export class InputSearchProceduresComponent implements OnInit {
  @Input({ required: true }) placeholder = 'Buscar tramite';
  @Output() searchEvent = new EventEmitter<void>();
  public FormSearch = new FormControl<string>('', [
    Validators.minLength(4),
    Validators.pattern(/^[^/!@#$%^&*()_+{}\[\]:;<>,.?~\\]*$/),
  ]);
  constructor(private paginatorService: PaginatorService) {}

  ngOnInit(): void {
    if (!this.paginatorService.isSearchMode) return;
    this.FormSearch.setValue(this.paginatorService.cache['text']);
  }

  search() {
    if (this.FormSearch.invalid || this.FormSearch.value === '') return;
    this.paginatorService.offset = 0;
    this.paginatorService.cache = { text: this.FormSearch.value };
    this.paginatorService.searchMode.set(true);
    this.searchEvent.emit();
  }
  cancel() {
    if (this.FormSearch.value === '') {
      return;
    }
    this.FormSearch.reset('');
    this.paginatorService.searchMode.set(false);
    this.paginatorService.emptyCache();
    this.paginatorService.offset = 0;
    this.searchEvent.emit();

    // this.FormSearch.setErrors(null);
    // this.paginatorService.resetPagination();
    // this.paginatorService.searchParams.clear();
    //
  }
  getErrorMessage() {
    if (this.FormSearch.hasError('minlength')) {
      return 'Ingrese al menos 4 caracteres';
    }
    return this.FormSearch.hasError('pattern') ? 'No se permiten caracteres especiales' : '';
  }
}
