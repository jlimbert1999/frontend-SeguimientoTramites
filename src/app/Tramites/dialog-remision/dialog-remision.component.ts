import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BandejaService } from '../services/bandeja.service';
import { SocketService } from '../services/socket.service';
import Swal from 'sweetalert2';
import { EnvioModel, Mail, UsersMails } from '../models/mail.model';
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
  public bankCtrl: UntypedFormControl = new UntypedFormControl();
  public bankFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();
  /** control for the selected bank */
  public UserCtrl: FormControl = new FormControl('', Validators.required);
  /** control for the MatSelect filter keyword */
  public userFilterCtrl: FormControl = new FormControl('');
  /** list of banks filtered by search keyword */
  public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('userSelect', { static: true }) userSelect: MatSelect;
  protected _onDestroy2 = new Subject<void>();

  FormEnvio: FormGroup = this.fb.group({
    motivo: ['PARA SU ATENCION', Validators.required],
    cantidad: [this.Data.tramite.cantidad, Validators.required],
    numero_interno: ['']
  });

  constructor(
    private bandejaService: BandejaService,
    private socketService: SocketService,
    private authService: AuthService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public Data: Mail,
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
    this.bandejaService.getInstituciones().subscribe(inst => {
      this.instituciones = inst
    })
  }

  getDependencias(id_institucion: string) {
    this.UserCtrl.setValue('');
    this.funcionarios = []
    this.bandejaService.getDependencias(id_institucion).subscribe(deps => {
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
    this.UserCtrl.setValue('');
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
      this.filteredUsers.next(this.funcionarios);
      this.userFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy2))
        .subscribe(() => {
          this.filterUsers();
        });
    })
  }

  send() {
    let receptor = this.UserCtrl.value
    let mail: EnvioModel = {
      id_tramite: this.Data._id,
      tipo: this.Data.tipo,
      ...this.FormEnvio.value,
      emisor: {
        cuenta: this.authService.Account.id_cuenta,
        funcionario: this.authService.Account.funcionario.nombre_completo,
        cargo: this.authService.Account.funcionario.cargo
      },
      receptor: {
        cuenta: receptor.id_cuenta,
        funcionario: receptor.fullname,
        cargo: receptor.jobtitle
      }
    }
    
    Swal.fire({
      title: `Remitir el tramite ${this.Data.tramite.alterno}?`,
      text: `El tramite sera remitito al funcionario ${receptor.fullname} (${receptor.jobtitle})`,
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
        this.bandejaService.AddMail(mail).subscribe(tramite => {
          if (receptor.online) {
            this.socketService.socket.emit("mail", { id_cuenta: receptor.id_cuenta, tramite })
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
      this.filteredUsers.next(this.funcionarios);
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredUsers.next(
      this.funcionarios.filter(user => user.fullname.toLowerCase().indexOf(search) > -1 || user.jobtitle.toLowerCase().indexOf(search) > -1)
    );
  }

  allowSend() {
    if (this.FormEnvio.valid && this.UserCtrl.valid) {
      return false
    }
    return true
  }
}
