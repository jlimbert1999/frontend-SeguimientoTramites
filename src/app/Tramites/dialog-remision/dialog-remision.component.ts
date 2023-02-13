import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { ReplaySubject, Subject, take, takeUntil, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BandejaService } from '../services/bandeja.service';
import { SocketService } from '../services/socket.service';
import Swal from 'sweetalert2';
import { EnvioModel, Mail, MailDto, UsersMails } from '../models/mail.model';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-remision',
  templateUrl: './dialog-remision.component.html',
  styleUrls: ['./dialog-remision.component.css'],
})
export class DialogRemisionComponent implements OnInit, OnDestroy {
  accounts: UsersMails[] = [];
  socketIds: string[] = [];

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
    private bandejaService: BandejaService,
    private socketService: SocketService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public Data: Mail,
    public dialogRef: MatDialogRef<DialogRemisionComponent>,
    private toastr: ToastrService
  ) {}

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit(): void {
    this.filteredUsers.next(this.accounts);
    this.userFilterCtrl.valueChanges
      .pipe(
        tap(() => (this.searching = true)),
        takeUntil(this._onDestroy)
      )
      .subscribe((text) => {
        if (text || text !== '') {
          this.bandejaService.getUsersForSend(text).subscribe((users) => {
            this.searching = false;
            users.map((user) => {
              let onlineUser = this.socketService.OnlineUsers.find(
                (userSocket) => userSocket.id_cuenta === user._id
              );
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
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Enviando el tramite....',
          text: 'Por favor espere',
          allowOutsideClick: false,
        });
        Swal.showLoading();
        this.bandejaService.AddMail(mails).subscribe((tramite) => {
          // if (ids.length > 0) {
          //   // this.socketService.socket.emit("mail", { ids, tramite })
          // }
          this.toastr.success(undefined, 'Tramite enviado!', {
            positionClass: 'toast-bottom-right',
            timeOut: 3000,
          });
          // this.dialogRef.close(tramite);
          Swal.close();
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
    let found = this.accounts.find((element) => element._id === user._id);
    if (!found) {
      if (user.online) {
        this.socketIds.push(user._id);
      }
      delete user.online
      this.accounts.push(user);
    }
  }
  removeReceiver(user: any): void {
    this.accounts = this.accounts.filter((item) => item._id !== user._id);
  }
}
