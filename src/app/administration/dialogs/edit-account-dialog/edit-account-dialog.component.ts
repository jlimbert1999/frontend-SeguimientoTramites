import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CuentaService } from 'src/app/administration/services/cuenta.service';
import { role } from '../../interfaces/role.interface';
import { createAccountPDF } from '../../helpers/pdfs/pdf-account';
import { Account, Officer } from '../../models';
import { AlertService } from 'src/app/shared/services';

@Component({
  selector: 'app-edit-account-dialog',
  templateUrl: './edit-account-dialog.component.html',
  styleUrls: ['./edit-account-dialog.component.scss'],
})
export class EditAccountDialogComponent implements OnInit {
  FormAccount: FormGroup = this.fb.group({
    login: ['', Validators.required],
    rol: ['', Validators.required],
  });
  roles: role[] = [];
  officers: Officer[] = [];
  updatePassword: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Account,
    private fb: FormBuilder,
    private cuentaService: CuentaService,
    private dialogRef: MatDialogRef<EditAccountDialogComponent>,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.FormAccount.patchValue(this.data);
    forkJoin([this.cuentaService.getRoles()]).subscribe((data) => {
      this.roles = data[0];
    });
  }

  unlinkAccount() {
    this.alertService.showQuestionAlert('Desvincular cuenta', 'Perdear acceso', () => {
      this.cuentaService.unlinkAccount(this.data._id).subscribe(() => {
        delete this.data.funcionario;
      });
    });
  }

  searchOfficer(text: string) {
    this.cuentaService.getOfficersForAssign(text).subscribe((data) => {
      this.officers = data;
    });
  }
  selectOfficer(officer: Officer) {
    // Swal.fire({
    //   title: `Asignar la cuenta a ${officer.fullWorkTitle}`,
    //   text: `El funcionario obtendra todos los registros realizados con esta cuenta`,
    //   icon: 'question',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Aceptar',
    //   cancelButtonText: 'Cancelar',
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     // this.cuentaService.assignAccountOfficer(this.data._id, officer._id).subscribe((account) => {
    //     //   this.data = account;
    //     //   this.changeForm(true);
    //     //   const login = officer.nombre.charAt(0) + officer.paterno + officer.materno.charAt(0);
    //     //   this.FormAccount.get('login')?.setValue(login.replace(/\s/g, '').toUpperCase());
    //     //   this.FormAccount.get('password')?.setValue(officer.dni.toString().replace(/\s/g, ''));
    //     //   this.disableCloseButton = true;
    //     // });
    //   } else {
    //     this.officers = [];
    //   }
    // });
  }

  save() {
    this.cuentaService.edit(this.data._id, this.FormAccount.value).subscribe((account) => {
      const updatePassword = this.FormAccount.get('password')?.value;
      if (updatePassword && this.data.funcionario) {
        createAccountPDF(account, updatePassword);
      }
      this.dialogRef.close(account);
    });
  }

  togglePassword(value: boolean) {
    if (value) {
      this.FormAccount.setControl('password', new FormControl(this.data.funcionario?.dni ?? ''));
    } else {
      this.FormAccount.removeControl('password');
    }
  }
}
