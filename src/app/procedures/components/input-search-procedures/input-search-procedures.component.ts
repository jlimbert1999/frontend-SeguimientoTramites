import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { PaginatorService } from 'src/app/shared/services';

@Component({
  selector: 'app-input-search-procedures',
  templateUrl: './input-search-procedures.component.html',
  styleUrls: ['./input-search-procedures.component.scss'],
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule],
})
export class InputSearchProceduresComponent implements OnInit {
  @Input({ required: true }) placeholder = 'Buscar tramite';
  @Output() searchEvent = new EventEmitter<void>();
  public FormSearch = new FormControl('', [
    Validators.minLength(4),
    Validators.pattern(/^[^/!@#$%^&*()_+{}\[\]:;<>,.?~\\]*$/),
  ]);
  constructor(private paginatorService: PaginatorService) {}
  ngOnInit(): void {
    if (!this.paginatorService.searchMode) return;
    const searchText = this.paginatorService.searchParams.get('text');
    if (!searchText) {
      this.paginatorService.resetPagination();
      this.paginatorService.searchParams.clear();
      return;
    }
    this.FormSearch.setValue(searchText);
  }

  search() {
    if (this.FormSearch.invalid) return;
    this.paginatorService.offset = 0;
    this.paginatorService.cache = { text: this.FormSearch.value };
    this.searchEvent.emit();
  }
  cancel() {
    if (this.FormSearch.value === '') {
      return;
    }
    this.paginatorService.searchMode = false;
    this.paginatorService.offset = 0;
    this.searchEvent.emit();

    // this.FormSearch.setValue('');
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
