import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ReplaySubject, Subject, map, switchMap, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InboxService } from '../../services/inbox.service';
import { SocketService } from 'src/app/services/socket.service';
import { receiver } from '../../interfaces/receiver.interface';
import { dependency, institution } from 'src/app/administration/interfaces';
import { sendDetail } from '../../interfaces';
import { CreateMailDto } from '../../dto/create-mail.dto';

@Component({
  selector: 'app-send-dialog',
  templateUrl: './send-dialog.component.html',
  styleUrls: ['./send-dialog.component.scss'],
})
export class SendDialogComponent implements OnInit, OnDestroy {
  receivers: receiver[] = []
  public userCtrl = new FormControl();
  public userFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredUsers: ReplaySubject<receiver[]> = new ReplaySubject<receiver[]>(1);
  protected _onDestroy = new Subject<void>();
  institutions: institution[] = []
  dependencies: dependency[] = []
  selectedReceivers: receiver[] = [];
  FormEnvio: FormGroup = this.fb.group({
    motivo: ['PARA SU ATENCION', Validators.required],
    cantidad: [this.data.amount, Validators.required],
    numero_interno: ['']
  });


  constructor(
    private bandejaService: InboxService,
    private socketService: SocketService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: sendDetail,
    public dialogRef: MatDialogRef<SendDialogComponent>
  ) { }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit(): void {
    this.bandejaService.getInstitucions().subscribe(data => {
      this.institutions = data
    })
  }

  send() {
    const mail = CreateMailDto.fromFormData(this.FormEnvio.value, this.data, this.selectedReceivers)
    Swal.fire({
      title: `Remitir el tramite ${this.data.procedure.alterno}?`,
      text: `Numero de destinatarios: ${mail.receivers.length}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Swal.fire({
        //   title: 'Enviando el tramite....',
        //   text: 'Por favor espere',
        //   allowOutsideClick: false,
        // });
        this.bandejaService.Add(mail).subscribe(data => {
          const receiversId = this.selectedReceivers.filter(receiver => receiver.online).map(receiver => receiver.id_account)
         
          Swal.close();
          // this.dialogRef.close({})
        });
      }
    });
  }
  addReceiver(account: receiver) {
    this.userCtrl.setValue(null)
    const found = this.selectedReceivers.some((accountForSend) => accountForSend.id_account === account.id_account);
    if (!found) {
      this.selectedReceivers.push(account);
    }
  }
  removeReceiver(account: receiver) {
    this.selectedReceivers = this.selectedReceivers.filter(receiver => receiver.id_account !== account.id_account);
  }

  selectInstitution(institution: institution) {
    this.filteredUsers.next([])
    this.receivers = []
    this.bandejaService.getDependenciesOfInstitution(institution._id).subscribe(data => {
      this.dependencies = data
    })
  }
  selectDependencie(dependencie: dependency) {
    this.bandejaService.getAccountsOfDependencie(dependencie._id)
      .pipe(
        switchMap(data => {
          return this.socketService.onlineUsers$
            .pipe(
              takeUntil(this._onDestroy),
              map(onlineUsers => {
                return data.map(account => {
                  account.online = onlineUsers.some(userSocket => userSocket.id_account === account.id_account);
                  return account;
                });
              })
            );
        })
      )
      .subscribe(data => {
        this.receivers = data;
        this.userCtrl.setValue(this.receivers);
        this.filteredUsers.next(this.receivers.slice());
        this.userFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterAccounts();
          });
      })
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
      this.receivers.filter(user => user.officer.fullname.toLowerCase().indexOf(search) > -1 || user.officer.jobtitle.toLowerCase().indexOf(search) > -1)
    );
  }
  get isDisabledButton() {
    return this.FormEnvio.invalid || this.selectedReceivers.length === 0;
  }
}
