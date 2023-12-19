import { FormBuilder, FormControl, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReplaySubject, Subject, map, switchMap, takeUntil } from 'rxjs';

import { InboxService } from '../../services/inbox.service';
import { SocketService } from 'src/app/services/socket.service';
import { TransferDetails, receiver } from '../../interfaces';
import { MatSelectSearchData } from 'src/app/shared/interfaces';
import { AlertService } from 'src/app/shared/services';

@Component({
  selector: 'app-send-dialog',
  templateUrl: './send-dialog.component.html',
  styleUrls: ['./send-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendDialogComponent implements OnInit, OnDestroy {
  institutions = signal<MatSelectSearchData<string>[]>([]);
  dependencies = signal<MatSelectSearchData<string>[]>([]);
  receivers = signal<receiver[]>([]);

  public userCtrl = new FormControl();
  public userFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredUsers: ReplaySubject<receiver[]> = new ReplaySubject<receiver[]>(1);
  protected _onDestroy = new Subject<void>();

  selectedReceivers: receiver[] = [];
  FormEnvio: FormGroup = this.fb.group({
    motivo: ['PARA SU ATENCION', Validators.required],
    cantidad: [this.data.attachmentQuantity, Validators.required],
    numero_interno: [''],
  });

  constructor(
    private readonly alertService: AlertService,
    private readonly inboxService: InboxService,
    private socketService: SocketService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: TransferDetails,
    public dialogRef: MatDialogRef<SendDialogComponent>
  ) {}

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit(): void {
    this.getInstitutions();
  }
  getInstitutions() {
    this.inboxService.getInstitucions().subscribe((data) => {
      this.institutions.set(data.map((inst) => ({ value: inst._id, text: inst.nombre })));
    });
  }
  selectInstitution(id_institution: string) {
    this.filteredUsers.next([]);
    this.receivers.set([]);
    this.inboxService.getDependenciesOfInstitution(id_institution).subscribe((data) => {
      this.dependencies.set(data.map((dependency) => ({ value: dependency._id, text: dependency.nombre })));
    });
  }
  selectDependency(id_dependency: string) {
    this.inboxService
      .getAccountsForSend(id_dependency)
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
      .subscribe((accounts) => {
        this.receivers.set(accounts);
        this.userCtrl.setValue(this.receivers());
        this.filteredUsers.next(this.receivers().slice());
        this.userFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
          this.filterAccounts();
        });
      });
  }

  send(): void {
    this.alertService.showQuestionAlert(
      `¿Remitir el tramite ${this.data.code}?`,
      `Numero de destinatarios: ${this.selectedReceivers.length}`,
      () => {
        this.alertService.showLoadingAlert('Enviado el tramite.....', 'Por favor espere');
        this.inboxService.create(this.data, this.FormEnvio.value, this.selectedReceivers).subscribe((data) => {
          this.alertService.closeLoadingAlert();
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
  protected filterAccounts() {
    if (!this.receivers) {
      return;
    }
    let search = this.userFilterCtrl.value;
    if (!search) {
      this.filteredUsers.next(this.receivers());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredUsers.next(
      this.receivers().filter(
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
