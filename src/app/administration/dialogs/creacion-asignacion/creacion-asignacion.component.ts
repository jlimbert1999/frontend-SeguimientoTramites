import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CuentaService } from 'src/app/administration/services/cuenta.service';
import { role } from '../../interfaces/role.interface';
import { MatSelectSearchData } from 'src/app/shared/interfaces';
import { Officer } from '../../models';

@Component({
  selector: 'app-creacion-asignacion',
  templateUrl: './creacion-asignacion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreacionAsignacionComponent implements OnInit {
  institutions = signal<MatSelectSearchData<string>[]>([]);
  dependencies = signal<MatSelectSearchData<string>[]>([]);
  officers = signal<MatSelectSearchData<Officer>[]>([]);
  roles = signal<role[]>([]);
  hidePassword = true;

  FormAccount: FormGroup = this.fb.group({
    login: ['', [Validators.required, Validators.pattern(/^\S+$/), Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.pattern(/^\S+$/)]],
    rol: ['', Validators.required],
    dependencia: ['', Validators.required],
    funcionario: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreacionAsignacionComponent>,
    private accountService: CuentaService
  ) {}

  ngOnInit(): void {
    this.accountService.getRoles().subscribe((roles) => this.roles.set(roles));
  }

  save() {
    this.accountService.assign(this.FormAccount.value).subscribe((account) => {
      this.dialogRef.close(account);
    });
  }

  searchInstitutions(term: string) {
    this.accountService.getInstitutions(term).subscribe((data) => {
      this.institutions.set(data.map((inst) => ({ text: inst.nombre, value: inst._id })));
    });
  }

  searchDependencies(id_institucion: string) {
    this.accountService.getDependenciesOfInstitution(id_institucion).subscribe((data) => {
      this.dependencies.set(data.map((dependency) => ({ value: dependency._id, text: dependency.nombre })));
    });
  }
  searchOfficers(term: string) {
    this.accountService
      .searchOfficersWithoutAccount(term)
      .subscribe((resp) => this.officers.set(resp.map((officer) => ({ value: officer, text: officer.fullWorkTitle }))));
  }

  selectDependency(id_dependency: string): void {
    this.FormAccount.get('dependencia')?.setValue(id_dependency);
  }

  selectOfficer(officer: Officer) {
    const formData = {
      login: officer.nombre.charAt(0) + officer.paterno + officer.nombre.charAt(0),
      password: officer.dni,
      funcionario: officer._id,
    };
    this.FormAccount.patchValue(formData);
  }
}
