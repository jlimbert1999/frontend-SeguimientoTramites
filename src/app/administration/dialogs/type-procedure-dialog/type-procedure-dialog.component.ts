import { ChangeDetectionStrategy, Component, DestroyRef, Inject, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject, map, startWith, takeUntil } from 'rxjs';

import { TypeProcedureService } from '../../services/type-procedure.service';
import { requirement, typeProcedure } from '../../interfaces/typeProcedure.interface';

@Component({
  selector: 'app-type-procedure-dialog',
  templateUrl: './type-procedure-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypeProcedureDialogComponent {
  private destroy$ = new Subject<void>();
  segments = signal<string[]>([]);
  FormTypeProcedure: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    segmento: ['', Validators.required],
    tipo: ['', Validators.required],
    requerimientos: this.fb.array([]),
  });

  filteredSegments: Observable<string[]>;
  dataSource: requirement[] = [];
  denieRequirements: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TypeProcedureDialogComponent>,
    private typeService: TypeProcedureService,
    @Inject(MAT_DIALOG_DATA) public type?: typeProcedure
  ) {
    inject(DestroyRef).onDestroy(() => {
      this.destroy$.next();
      this.destroy$.complete();
    });
  }

  ngOnInit(): void {
    if (this.type) {
      this.FormTypeProcedure.removeControl('tipo');
      this.FormTypeProcedure.removeControl('segmento');
      this.type.requerimientos.forEach(() => this.addRequirement());
      this.FormTypeProcedure.patchValue(this.type);
    } else {
      this.typeService.getSegments().subscribe((segments) => {
        this.segments.set(segments);
        this.filteredSegments = this.FormTypeProcedure.get('segmento')!.valueChanges.pipe(
          takeUntil(this.destroy$),
          startWith(''),
          map((value) => this._filterSegments(value || ''))
        );
      });
    }
  }

  save() {
    const subscription = this.type
      ? this.typeService.edit(this.type._id, this.FormTypeProcedure.value)
      : this.typeService.add(this.FormTypeProcedure.value);
    subscription.subscribe((resp) => {
      this.dialogRef.close(resp);
    });
  }

  addRequirement() {
    this.requeriments.push(
      this.fb.group({
        nombre: ['', Validators.required],
        activo: true,
      })
    );
  }

  removeRequirement(index: number) {
    this.requeriments.removeAt(index);
  }

  get requeriments() {
    return this.FormTypeProcedure.get('requerimientos') as FormArray;
  }

  private _filterSegments(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.segments().filter((option) => option.toLowerCase().includes(filterValue));
  }
}
