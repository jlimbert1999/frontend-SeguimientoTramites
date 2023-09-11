import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { CuentaService } from 'src/app/administration/services/cuenta.service';
import { account } from '../../interfaces/account.interface';
import { role } from '../../interfaces/role.interface';
import { createAccountPDF } from '../../helpers/pdfs/pdf-account';
import { Officer } from '../../models/officer.model';

@Component({
  selector: 'app-edit-account-dialog',
  templateUrl: './edit-account-dialog.component.html',
  styleUrls: ['./edit-account-dialog.component.scss'],
})
export class EditAccountDialogComponent implements OnInit {
  Form_Cuenta: FormGroup = this.fb.group({
    login: ['', Validators.required],
    rol: ['', Validators.required],
  });
  updatePassword: boolean = false;
  roles: role[] = [];
  officers: Officer[] = [];
  disableCloseButton: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: account,
    private fb: FormBuilder,
    private cuentaService: CuentaService,
    public dialogRef: MatDialogRef<EditAccountDialogComponent>
  ) {}

  ngOnInit(): void {
    this.Form_Cuenta.patchValue(this.data);
    forkJoin([this.cuentaService.getRoles()]).subscribe((data) => {
      this.roles = data[0];
    });
  }

  changeForm(value: boolean) {
    this.updatePassword = value;
    if (value) {
      const password = this.data.funcionario
        ? this.data.funcionario.dni
        : '000000';
      this.Form_Cuenta = this.fb.group({
        login: [this.data.login, Validators.required],
        rol: [this.data.rol, Validators.required],
        password: [password, Validators.required],
      });
    } else {
      this.Form_Cuenta = this.fb.group({
        login: [this.data.login, Validators.required],
        rol: [this.data.rol, Validators.required],
      });
    }
  }

  unlinkUser() {
    if (!this.data.funcionario) return;
    Swal.fire({
      title: `Desvincular la cuenta?`,
      text: `${this.data.funcionario.nombre} ${this.data.funcionario.paterno} ${this.data.funcionario.materno} perdera el acceso y la cuenta estara deshabilitada hasta una nueva asignacion`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cuentaService
          .unlinkAccountOfficer(this.data._id)
          .subscribe((account) => {
            this.data = account;
            this.disableCloseButton = true;
          });
      }
    });
  }

  searchOfficer(text: string) {
    this.cuentaService.getOfficersForAssign(text).subscribe((data) => {
      this.officers = data;
    });
  }
  selectOfficer(officer: Officer) {
    Swal.fire({
      title: `Asignar la cuenta a ${officer.fullWorkTitle}`,
      text: `El funcionario obtendra todos los registros realizados con esta cuenta`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cuentaService
          .assignAccountOfficer(this.data._id, officer._id)
          .subscribe((account) => {
            this.data = account;
            this.changeForm(true);
            const login =
              officer.nombre.charAt(0) +
              officer.paterno +
              officer.materno.charAt(0);
            this.Form_Cuenta.get('login')?.setValue(
              login.replace(/\s/g, '').toUpperCase()
            );
            this.Form_Cuenta.get('password')?.setValue(
              officer.dni.toString().replace(/\s/g, '')
            );
            this.disableCloseButton = true;
          });
      } else {
        this.officers = [];
      }
    });
  }

  save() {
    this.cuentaService
      .edit(this.data._id, this.Form_Cuenta.value)
      .subscribe((account) => {
        const updatePassword = this.Form_Cuenta.get('password')?.value;
        if (updatePassword && this.data.funcionario) {
          createAccountPDF(account, updatePassword);
        }
        this.dialogRef.close(account);
      });
  }
}
