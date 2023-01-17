import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BandejaService } from '../services/bandeja.service';
import { SocketService } from '../services/socket.service';
import Swal from 'sweetalert2';
import { EnvioModel, UsersMails } from '../models/mail.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-remision',
  templateUrl: './dialog-remision.component.html',
  styleUrls: ['./dialog-remision.component.css']
})
export class DialogRemisionComponent implements OnInit, OnDestroy {
  instituciones: any[] = []
  dependencias: any[] = []
  funcionarios: UsersMails[] = []
  receptor: UsersMails
  motivo: string
  public bankCtrl: UntypedFormControl = new UntypedFormControl();
  public bankFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  public UserCtrl: UntypedFormControl = new UntypedFormControl();
  public userFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('userSelect', { static: true }) userSelect: MatSelect;
  protected _onDestroy2 = new Subject<void>();

  FormEnvio: FormGroup = this.fb.group({
    motivo: ['Para su atencion', Validators.required],
    cantidad: [this.Data.tramite.cantidad, Validators.required],
    numero_interno: ['']
  });

  constructor(
    private bandejaService: BandejaService,
    private socketService: SocketService,
    private authService: AuthService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public Data: {
      _id: string,
      tipo: 'tramites_externos' | 'tramites_internos',
      tramite: {
        nombre: string,
        alterno: string,
        cantidad: string
      }
    },
    public dialogRef: MatDialogRef<DialogRemisionComponent>,
    private toastr: ToastrService,
  ) { }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
    this._onDestroy2.next();
    this._onDestroy2.complete();
  }

  ngOnInit(): void {
    this.bandejaService.obtener_instituciones_envio().subscribe(inst => {
      this.instituciones = inst
    })
  }

  obtener_dependencias(id_institucion: string) {
    this.funcionarios = []
    this.bandejaService.obtener_dependencias_envio(id_institucion).subscribe(deps => {
      this.dependencias = deps
      this.bankCtrl.setValue(this.dependencias);
      this.filteredBanks.next(this.dependencias.slice());
      this.bankFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterBanks();
        });
    })
  }
  getUsers(id_dependencia: string) {
    this.funcionarios = []
    this.bandejaService.getUsersForSend(id_dependencia).subscribe(users => {
      users.forEach(user => {
        if (user.id_cuenta !== this.authService.Account.id_cuenta) {
          let onlineUser = this.socketService.OnlineUsers.find(userSocket => userSocket.id_cuenta === user.id_cuenta)
          if (onlineUser) {
            user.online = true
          }
          this.funcionarios.push(user)
        }
      })
      this.UserCtrl.setValue(this.funcionarios);
      this.filteredUsers.next(this.funcionarios.slice());
      this.userFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy2))
        .subscribe(() => {
          this.filterUsers();
        });
    })
  }
  seleccionar_receptor() {
    this.receptor = this.UserCtrl.value
  }

  send() {
    let nuevoEnvio: EnvioModel = {
      id_tramite: this.Data._id,
      motivo: this.FormEnvio.get('motivo')?.value,
      cantidad: this.FormEnvio.get('cantidad')?.value,
      numero_interno: this.FormEnvio.get('numero_interno')?.value,
      tipo: this.Data.tipo,
      emisor: {
        cuenta: this.authService.Account.id_cuenta,
        funcionario: this.authService.Account.funcionario.nombre_completo,
        cargo: this.authService.Account.funcionario.cargo
      },
      receptor: {
        cuenta: this.receptor.id_cuenta,
        funcionario: this.receptor.fullname,
        cargo: this.receptor.jobtitle
      }
    }
    Swal.fire({
      title: `Enviar tramite?`,
      text: `El funcionario ${this.receptor.fullname} (${this.receptor.jobtitle}) recibira el tramite`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.bandejaService.agregar_mail(nuevoEnvio).subscribe(tramite => {
          if (this.receptor.online) {
            this.socketService.socket.emit("mail", { id_cuenta: this.receptor.id_cuenta, tramite })
          }
          this.toastr.success(undefined, 'Tramite enviado!', {
            positionClass: 'toast-bottom-right',
            timeOut: 3000,
          })
          this.dialogRef.close({})
        })
      }
    })
  }


  protected filterBanks() {
    if (!this.dependencias) {
      return;
    }
    let search = this.bankFilterCtrl.value;
    if (!search) {
      this.filteredBanks.next(this.dependencias.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredBanks.next(
      this.dependencias.filter(bank => bank.nombre.toLowerCase().indexOf(search) > -1)
    );
  }
  protected filterUsers() {
    if (!this.funcionarios) {
      return;
    }
    let search = this.userFilterCtrl.value;
    if (!search) {
      this.filteredUsers.next(this.funcionarios.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredUsers.next(
      this.funcionarios.filter(user => user.fullname.toLowerCase().indexOf(search) > -1 || user.jobtitle.toLowerCase().indexOf(search) > -1)
    );
  }
}
