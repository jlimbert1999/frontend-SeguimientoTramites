import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ReplaySubject, Subject, take, takeUntil, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BandejaService } from '../services/bandeja.service';
import { SocketService } from '../services/socket.service';
import Swal from 'sweetalert2';
import { EnvioModel, Mail } from '../models/mail.model';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-remision',
  templateUrl: './dialog-remision.component.html',
  styleUrls: ['./dialog-remision.component.css']
})
export class DialogRemisionComponent implements OnInit, OnDestroy {
  funcionarios: any[] = []
  public userFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();


  FormEnvio: FormGroup = this.fb.group({
    motivo: ['PARA SU ATENCION', Validators.required],
    cantidad: [this.Data.tramite.cantidad, Validators.required],
    numero_interno: ['']
  });
  public searching: boolean = false;

  constructor(
    private bandejaService: BandejaService,
    private socketService: SocketService,
    private authService: AuthService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public Data: Mail,
    public dialogRef: MatDialogRef<DialogRemisionComponent>,
    private toastr: ToastrService,
  ) {

  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit(): void {
    this.filteredUsers.next(this.funcionarios);
    this.userFilterCtrl.valueChanges
      .pipe(
        tap(() => this.searching = true),
        takeUntil(this._onDestroy))
      .subscribe((value) => {
        if (value || value !== '') {
          this.bandejaService.getUsersForSend(value).subscribe(users => {
            this.searching = false;
            users.map(user => {
              let onlineUser = this.socketService.OnlineUsers.find(userSocket => userSocket.id_cuenta === user._id)
              user['online'] = onlineUser ? true : false
            })
            this.filteredUsers.next(users);
          })
        }
      });
  }



  send() {
    let mails: EnvioModel[] = []
    let ids: string[] = []
    let mail={
      
    }
    this.funcionarios.forEach(user => {
      ids.push(user._id)
      mails.push({
        id_tramite: this.Data._id,
        tipo: this.Data.tipo,
        ...this.FormEnvio.value,
        emisor: {
          cuenta: this.authService.Account.id_cuenta,
          funcionario: this.authService.Account.funcionario.nombre_completo,
          cargo: this.authService.Account.funcionario.cargo
        },
        receptor: {
          cuenta: user._id,
          funcionario: user.funcionario.fullname,
          cargo: user.funcionario.cargo
        }
      })
    })


    Swal.fire({
      title: `Remitir el tramite ${this.Data.tramite.alterno}?`,
      text: `Esta opcion no puede deshacer.`,
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
        Swal.showLoading()
        this.bandejaService.AddMail(mails).subscribe(tramite => {
          if (ids.length > 0) {
            // this.socketService.socket.emit("mail", { ids, tramite })
          }
          this.toastr.success(undefined, 'Tramite enviado!', {
            positionClass: 'toast-bottom-right',
            timeOut: 3000,
          })
          this.dialogRef.close(tramite)
          Swal.close()
        })
      }
    })



  }

  allowSend() {

    if (this.FormEnvio.valid && this.funcionarios.length !== 0) {
      return false
    }
    return true
  }
  addReceiver(user: any) {
    this.filteredUsers.next([])
    let found = this.funcionarios.find(element => element._id === user._id)
    if (!found) this.funcionarios.push(user)
  }
  removeReceiver(user: any): void {
    this.funcionarios = this.funcionarios.filter(item => item._id !== user._id)
  }
}
