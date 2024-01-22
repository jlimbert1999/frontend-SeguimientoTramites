import { ChangeDetectionStrategy, Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CuentaService } from 'src/app/administration/services/cuenta.service';
import { AlertService, PdfGeneratorService } from 'src/app/shared/services';
import { Account, Officer } from '../../models';
import { role } from '../../interfaces';
import { MatSelectSearchData } from 'src/app/shared/interfaces';
import { ReportService } from 'src/app/reports/services/report.service';

@Component({
  selector: 'app-edit-account-dialog',
  templateUrl: './edit-account-dialog.component.html',
  styleUrls: ['./edit-account-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAccountDialogComponent implements OnInit {
  public roles = signal<role[]>([]);
  public updatePassword: boolean = false;
  public officers = signal<MatSelectSearchData<Officer>[]>([]);
  public currentOfficer = signal<Officer | undefined>(undefined);
  public workDetails: { label: string; value: number }[] = [];
  public FormAccount: FormGroup = this.fb.group({
    login: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
    rol: ['', Validators.required],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Account,
    private fb: FormBuilder,
    private cuentaService: CuentaService,
    private dialogRef: MatDialogRef<EditAccountDialogComponent>,
    private alertService: AlertService,
    private pdfService: PdfGeneratorService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    const { funcionario, ...props } = this.data;
    this.FormAccount.patchValue(props);
    this.currentOfficer.set(funcionario);
    this.cuentaService.getRoles().subscribe((roles) => this.roles.set(roles));
    this.reportService.getWorkDetails(this.data._id).subscribe((data) => {
      this.workDetails = data;
    });
  }

  unlinkAccount() {
    if (!this.data.funcionario) {
      this.currentOfficer.set(undefined);
      return;
    }
    this.alertService.showQuestionAlert(
      `¿Desvincular cuenta de ${this.data.fullnameManager()}?`,
      `La cuenta quedará deshabilitada hasta que se realice una nueva asignación.`,
      () => {
        this.cuentaService.unlinkAccount(this.data._id).subscribe(() => {
          delete this.data.funcionario;
          this.currentOfficer.set(undefined);
        });
      }
    );
  }

  searchOfficer(text: string) {
    this.cuentaService.searchOfficersWithoutAccount(text).subscribe((data) => {
      this.officers.set(data.map((officer) => ({ value: officer, text: officer.fullWorkTitle })));
    });
  }

  selectOfficer(officer: Officer) {
    this.FormAccount.setControl('funcionario', new FormControl(officer._id, Validators.required));
    this.currentOfficer.set(officer);
    this.togglePassword(true);
  }

  save() {
    this.cuentaService.edit(this.data._id, this.FormAccount.value).subscribe((account) => {
      const updatedPassword = this.FormAccount.get('password')?.value;
      if (updatedPassword && this.data.funcionario) {
        this.pdfService.createAccountSheet(account, updatedPassword);
      }
      this.dialogRef.close(account);
    });
  }

  togglePassword(value: boolean) {
    this.updatePassword = value;
    if (!value) {
      this.FormAccount.removeControl('password');
      return;
    }
    this.FormAccount.setControl(
      'password',
      new FormControl(this.currentOfficer()?.dni ?? '', [Validators.required, Validators.pattern(/^[a-zA-Z0-9$]+$/)])
    );
  }
}
