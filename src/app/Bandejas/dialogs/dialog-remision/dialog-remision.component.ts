import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { ReplaySubject, Subject, takeUntil, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Mail, MailDto, UsersMails } from '../../models/mail.model';
import { BandejaEntradaService } from '../../services/bandeja-entrada.service';
import { SocketService } from 'src/app/home/services/socket.service';

@Component({
  selector: 'app-dialog-remision',
  templateUrl: './dialog-remision.component.html',
  styleUrls: ['./dialog-remision.component.css'],
})
export class DialogRemisionComponent implements OnInit, OnDestroy {
  accounts: UsersMails[] = [];
  public userCtrl = new FormControl<any[]>([]);
  public userFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();

  FormEnvio: FormGroup = this.fb.group({
    motivo: ['PARA SU ATENCION', Validators.required],
    cantidad: [this.Data.tramite.cantidad, Validators.required],
    numero_interno: [''],
  });
  public searching: boolean = false;

  constructor(
    private bandejaService: BandejaEntradaService,
    private socketService: SocketService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public Data: Mail,
    public dialogRef: MatDialogRef<DialogRemisionComponent>,
    private toastr: ToastrService
  ) { }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit(): void {
    this.filteredUsers.next(this.accounts);
    this.userFilterCtrl.valueChanges.pipe(tap(() => (this.searching = true)), takeUntil(this._onDestroy))
      .subscribe((text) => {
        if (text || text !== '') {
          this.bandejaService.GetAccounts(text).subscribe((users) => {
            this.searching = false;
            users.map((user) => {
              let onlineUser = this.socketService.onlineUsers.find((userSocket) => userSocket.id_cuenta === user._id);
              user.online = onlineUser ? true : false;
            });
            this.filteredUsers.next(users);
          });
        }
      });
  }

  send() {
    let mails: MailDto = {
      tramite: this.Data._id,
      tipo: this.Data.tipo,
      motivo: this.FormEnvio.get('motivo')?.value,
      cantidad: this.FormEnvio.get('cantidad')?.value,
      numero_interno: this.FormEnvio.get('numero_interno')?.value,
      receptores: this.accounts,
    };
    Swal.fire({
      title: `Remitir el tramite ${this.Data.tramite.alterno}?`,
      text: `Numero de destinatarios: ${this.accounts.length}`,
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
          const isOnline = this.accounts.some(account => account.online === true)
          if (isOnline) {
            this.socketService.socket.emit("mail", data)
          }
          Swal.close();
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
          Toast.fire({
            icon: 'success',
            title: 'Tramite enviado!'
          })
          this.dialogRef.close({})
        });
      }
    });
  }

  allowSend() {
    if (this.FormEnvio.valid && this.accounts.length !== 0) {
      return false;
    }
    return true;
  }
  addReceiver(user: UsersMails) {
    this.filteredUsers.next([]);
    let found = this.accounts.find((account) => account._id === user._id);
    if (!found) {
      this.accounts.push(user);
    }
  }
  removeReceiver(user: UsersMails): void {
    this.accounts = this.accounts.filter((item) => item._id !== user._id);
  }
}
