import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ReplaySubject, Subject, takeUntil, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BandejaEntradaService } from '../../services/bandeja-entrada.service';
import { AccountForSend, ImboxData } from '../../models/entrada.interface';
import { EntradaDto } from '../../models/entrada.dto';
import { SocketService } from 'src/app/home-old/services/socket.service';

@Component({
  selector: 'app-dialog-remision',
  templateUrl: './dialog-remision.component.html',
  styleUrls: ['./dialog-remision.component.scss'],
})
export class DialogRemisionComponent implements OnInit, OnDestroy {
  accountsForSend: AccountForSend[] = [];
  public userCtrl = new FormControl<any[]>([]);
  public userFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredUsers: ReplaySubject<AccountForSend[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();
  institutions: any[] = []
  dependencies: any[] = []
  receivers: AccountForSend[] = []
  FormEnvio: FormGroup = this.fb.group({
    motivo: ['PARA SU ATENCION', Validators.required],
    cantidad: [this.Data.tramite.cantidad, Validators.required],
    numero_interno: ['']
  });


  constructor(
    private bandejaService: BandejaEntradaService,
    private socketService: SocketService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public Data: ImboxData,
    public dialogRef: MatDialogRef<DialogRemisionComponent>
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
    let mails: EntradaDto = {
      tramite: this.Data._id,
      tipo: this.Data.tipo,
      motivo: this.FormEnvio.get('motivo')?.value,
      cantidad: this.FormEnvio.get('cantidad')?.value,
      numero_interno: this.FormEnvio.get('numero_interno')?.value,
      receptores: this.accountsForSend,
    };
    Swal.fire({
      title: `Remitir el tramite ${this.Data.tramite.alterno}?`,
      text: `Numero de destinatarios: ${this.accountsForSend.length}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Enviando el tramite....',
          text: 'Por favor espere',
          allowOutsideClick: false,
        });
        Swal.showLoading();
        this.bandejaService.Add(mails).subscribe(data => {
          const isRealTime = this.accountsForSend.some(account => account.online === true)
          if (isRealTime) {
            this.socketService.socket.emit("mail", data)
          }
          Swal.close();
          this.dialogRef.close({})
        });
      }
    });
  }
  addReceiver(account: AccountForSend) {
    this.userCtrl.setValue(null)
    const found = this.accountsForSend.find((accountForSend) => accountForSend._id === account._id);
    if (!found) {
      this.accountsForSend.push(account);
    }
  }
  removeReceiver(account: AccountForSend): void {
    this.accountsForSend = this.accountsForSend.filter((accountForSend) => accountForSend._id !== account._id);
  }

  selectInstitution(institution: any) {
    this.filteredUsers.next([])
    this.receivers = []
    this.bandejaService.getDependenciesOfInstitution(institution.id_institucion).subscribe(data => {
      this.dependencies = data
    })
  }
  selectDependencie(dependencie: any) {
    this.bandejaService.getAccountsOfDependencie(dependencie.id_dependencia).subscribe(data => {
      data.map((accountForSend) => {
        const onlineUser = this.socketService.onlineUsers.find((userSocket) => userSocket.id_account === accountForSend._id);
        accountForSend.online = onlineUser ? true : false;
      });
      this.receivers = data
      this.filteredUsers.next(this.receivers);
      this.userFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterAccounts()
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
      this.receivers.filter(user => user.funcionario.fullname.toLowerCase().indexOf(search) > -1 || user.funcionario.cargo.toLowerCase().indexOf(search) > -1)
    );
  }
  allowSend() {
    if (this.FormEnvio.valid && this.accountsForSend.length > 0) {
      return false;
    }
    return true;
  }
}
