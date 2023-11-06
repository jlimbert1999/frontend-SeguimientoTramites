import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaginatorService } from '../../../services/paginator.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-input-search-procedures',
  templateUrl: './input-search-procedures.component.html',
  styleUrls: ['./input-search-procedures.component.scss'],
})
export class InputSearchProceduresComponent implements OnInit {
  @Input() placeholder = 'Buscar....';
  @Output() searchEvent = new EventEmitter<undefined>();
  FormSearch = new FormControl('', [
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
    if (this.FormSearch.invalid || this.FormSearch.value === '') return;
    this.paginatorService.searchMode = true;
    this.paginatorService.offset = 0;
    this.paginatorService.searchParams.set('text', this.FormSearch.value!);
    this.searchEvent.emit();
  }
  cancel() {
    this.FormSearch.setValue('');
    this.FormSearch.setErrors(null);
    this.paginatorService.resetPagination();
    this.paginatorService.searchParams.clear();
    this.searchEvent.emit();
  }
  getErrorMessage() {
    if (this.FormSearch.hasError('minlength')) {
      return 'Ingrese al menos 4 caracteres';
    }
    return this.FormSearch.hasError('pattern') ? 'No se permiten caracteres especiales' : '';
  }
}
