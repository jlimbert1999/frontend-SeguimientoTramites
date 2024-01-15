import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { CuentaService } from 'src/app/administration/services/cuenta.service';
import { Officer } from '../../models/officer.model';
import { institution } from '../../interfaces/institution.interface';
import { dependency } from '../../interfaces/dependency.interface';
import { role } from '../../interfaces/role.interface';

@Component({
  selector: 'app-creacion-asignacion',
  templateUrl: './creacion-asignacion.component.html',
  styleUrls: ['./creacion-asignacion.component.scss'],
})
export class CreacionAsignacionComponent implements OnInit {
  dependencias: any[] = [];
  institutions: any[] = [];
  roles: role[] = [];
  officers: Officer[] = [];
  hidePassword = true;

  Form_Cuenta: FormGroup = this.fb.group({
    funcionario: [null, Validators.required],
    login: ['', [Validators.required, Validators.pattern(/^\S+$/), Validators.minLength(4), Validators.maxLength(10)]],
    password: ['', [Validators.required, Validators.pattern(/^\S+$/)]],
    rol: ['', Validators.required],
    dependencia: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreacionAsignacionComponent>,
    private cuentaService: CuentaService
  ) {}

  ngOnInit(): void {
    forkJoin([this.cuentaService.getInstitutions(), this.cuentaService.getRoles()]).subscribe((data) => {
      this.institutions = data[0].map((institution) => ({ value: institution._id, text: institution.nombre }));
      this.roles = data[1];
    });
  }
  save() {
    this.Form_Cuenta;
    this.cuentaService.addAccountWithAssign(this.Form_Cuenta.value).subscribe((account) => {
      this.dialogRef.close(account);
    });
  }

  searchOfficer(text: string) {
    this.cuentaService.getOfficersForAssign(text).subscribe((data) => {
      this.officers = data;
    });
  }
  selectOfficer(officer: Officer) {
    this.Form_Cuenta.get('funcionario')?.setValue(officer._id);
    const login = officer.nombre.charAt(0) + officer.paterno + officer.materno.charAt(0);
    this.Form_Cuenta.get('login')?.setValue(login.replace(/\s/g, '').toUpperCase());
    this.Form_Cuenta.get('password')?.setValue(officer.dni.toString().replace(/\s/g, ''));
  }
  getDependencies(id_institution: string) {
    this.Form_Cuenta.get('institucion')?.setValue(id_institution || '');
    this.cuentaService.getDependenciesOfInstitution(id_institution).subscribe((data) => {
      this.dependencias = data.map((dependency) => ({ value: dependency._id, text: dependency.nombre }));
    });
  }
  selectDependency(id_dependency: string) {
    this.Form_Cuenta.get('dependencia')?.setValue(id_dependency || '');
  }

  getErrorMessagesForm(control: AbstractControl) {
    if (control.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control.hasError('pattern')) {
      return 'El campo no puede contener espacios en blanco';
    }
    if (control.hasError('minlength')) {
      return 'El campo debe tener al menos 4 caracteres';
    }
    if (control.hasError('maxlength')) {
      return 'El campo no puede tener más de 10 caracteres';
    }
    return '';
  }
}
