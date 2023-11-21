import { FormBuilder, FormControl, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, Subject, map, switchMap, takeUntil } from 'rxjs';

import { InboxService } from '../../services/inbox.service';
import { SocketService } from 'src/app/services/socket.service';
import { receiver } from '../../interfaces';
import { CreateMailDto } from '../../dto/create-mail.dto';
import { AlertManager } from 'src/app/shared/helpers/alerts';
import { ProcedureTransferDetails } from '../../models/procedure-transfer-datais.mode';

@Component({
  selector: 'app-send-dialog',
  templateUrl: './send-dialog.component.html',
  styleUrls: ['./send-dialog.component.scss'],
})
export class SendDialogComponent implements OnInit, OnDestroy {
  institutions: any[] = [];
  dependencies: any[] = [];
  receivers: receiver[] = [];
  selectedReceivers: receiver[] = [];
  public userCtrl = new FormControl();
  public userFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredUsers: ReplaySubject<receiver[]> = new ReplaySubject<receiver[]>(1);
  protected _onDestroy = new Subject<void>();

  FormEnvio: FormGroup = this.fb.group({
    motivo: ['PARA SU ATENCION', Validators.required],
    cantidad: [this.data.attachmentQuantity, Validators.required],
    numero_interno: [''],
  });

  constructor(
    private inboxService: InboxService,
    private socketService: SocketService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ProcedureTransferDetails,
    public dialogRef: MatDialogRef<SendDialogComponent>
  ) {}

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit(): void {
    this.inboxService.getInstitucions().subscribe((data) => {
      this.institutions = data.map((institution) => ({ value: institution._id, text: institution.nombre }));
    });
  }

  send(): void {
    const mail = CreateMailDto.fromFormData(this.FormEnvio.value, this.data, this.selectedReceivers);
    AlertManager.showQuestionAlert(
      `¿Remitir el tramite ${this.data.procedure.code}?`,
      `Numero de destinatarios: ${mail.receivers.length}`,
      () => {
        AlertManager.showLoadingAlert('Enviado el tramite.....', 'Por favor espere');
        this.inboxService.create(mail).subscribe((data) => {
          AlertManager.closeLoadingAlert();
          this.dialogRef.close(true);
        });
      }
    );
  }

  addReceiver(account: receiver) {
    this.userCtrl.setValue(null);
    const found = this.selectedReceivers.some((accountForSend) => accountForSend.id_account === account.id_account);
    if (found) return;
    this.selectedReceivers.push(account);
  }
  removeReceiver(account: receiver) {
    this.selectedReceivers = this.selectedReceivers.filter((receiver) => receiver.id_account !== account.id_account);
  }

  selectInstitution(id_institution: string) {
    this.filteredUsers.next([]);
    this.receivers = [];
    this.inboxService.getDependenciesOfInstitution(id_institution).subscribe((data) => {
      this.dependencies = data.map((dependency) => ({ value: dependency._id, text: dependency.nombre }));
    });
  }
  selectDependencie(id_dependency: string) {
    this.inboxService
      .getAccountsOfDependencie(id_dependency)
      .pipe(
        switchMap((data) => {
          return this.socketService.onlineUsers$.pipe(
            takeUntil(this._onDestroy),
            map((onlineUsers) => {
              return data.map((account) => {
                account.online = onlineUsers.some((userSocket) => userSocket.id_account === account.id_account);
                return account;
              });
            })
          );
        })
      )
      .subscribe((data) => {
        this.receivers = data;
        this.userCtrl.setValue(this.receivers);
        this.filteredUsers.next(this.receivers.slice());
        this.userFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
          this.filterAccounts();
        });
      });
  }
  protected filterAccounts() {
    if (!this.receivers) {
      return;
    }
    let search = this.userFilterCtrl.value;
    if (!search) {
      this.filteredUsers.next(this.receivers);
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredUsers.next(
      this.receivers.filter(
        (user) =>
          user.officer.fullname.toLowerCase().indexOf(search) > -1 ||
          user.officer.jobtitle.toLowerCase().indexOf(search) > -1
      )
    );
  }
  get isDisabledButton() {
    return this.FormEnvio.invalid || this.selectedReceivers.length === 0;
  }
}
