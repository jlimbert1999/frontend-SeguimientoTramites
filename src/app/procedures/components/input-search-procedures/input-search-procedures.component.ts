import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-input-search-procedures',
  templateUrl: './input-search-procedures.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule],
})
export class InputSearchProceduresComponent {
  @Input({ required: true }) placeholder = 'Buscar tramite';
  @Input() set initialValue(value: string) {
    this.FormSearch.setValue(value);
  }
  @Output() searchEvent = new EventEmitter<string>();
  public FormSearch = new FormControl<string>('', [
    Validators.minLength(4),
    Validators.pattern(/^[^/!@#$%^&*()_+{}\[\]:;<>,.?~\\]*$/),
  ]);

  search() {
    if (this.FormSearch.invalid || this.FormSearch.value === '') return;
    this.searchEvent.emit(this.FormSearch.value ?? '');
  }
  cancel() {
    this.FormSearch.reset('');
    this.searchEvent.emit('');
  }

  getErrorMessage() {
    if (this.FormSearch.hasError('minlength')) {
      return 'Ingrese al menos 4 caracteres';
    }
    return this.FormSearch.hasError('pattern') ? 'No se permiten caracteres especiales' : '';
  }
}
