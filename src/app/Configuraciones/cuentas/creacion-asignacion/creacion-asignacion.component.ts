import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, ReplaySubject, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { CuentaService } from '../../services/cuenta.service';
import { crear_hoja_usuarios } from 'src/app/generacion_pdfs/usuario';

@Component({
  selector: 'app-creacion-asignacion',
  templateUrl: './creacion-asignacion.component.html',
  styleUrls: ['./creacion-asignacion.component.css']
})
export class CreacionAsignacionComponent implements OnInit {
  dependencias: { id_dependencia: string, nombre: string }[] = [];
  Instituciones: { id_institucion: string, nombre: string }[] = [];
  Funcionarios: { _id: string, nombre: string, cargo: string, dni: string }[] = []
  Funcionario_Asignado: { _id: string, nombre: string, cargo: string, dni: string } | null
  Roles = [
    { value: 'recepcion', viewValue: 'Recepcion de tramites' },
    { value: 'evaluacion', viewValue: 'Evaluacion de tramites' }
  ]

  Form_Cuenta: FormGroup = this.fb.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
    rol: ['', Validators.required],
    dependencia: ['', Validators.required],
    funcionario: ['', Validators.required]
  });


  public bankCtrl: FormControl = new FormControl();
  public bankFilterCtrl: FormControl = new FormControl();
  public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('singleSelect') singleSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  public userCtrl: FormControl = new FormControl();
  public userFilterCtrl: FormControl = new FormControl();
  public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('userSelect') userSelect: MatSelect;
  protected _onDestroy_users = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreacionAsignacionComponent>,
    private cuentasService: CuentaService
  ) { }

  ngOnInit(): void {
    forkJoin([this.cuentasService.obtener_instituciones_hablitadas(), this.cuentasService.obtener_funcionarios_asignacion()]).subscribe(data => {
      this.Instituciones = data[0]
      this.Funcionarios = data[1]

      this.userCtrl.setValue(this.Funcionarios);
      this.filteredUsers.next(this.Funcionarios.slice());
      this.userFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy_users))
        .subscribe(() => {
          this.filterUsers();
        });
    })
  }
  seleccionar_institucion(id_institucion: string) {
    this.cuentasService.obtener_dependencias_hablitadas(id_institucion).subscribe(dep => {
      this.dependencias = dep
      this.bankCtrl.setValue(this.dependencias);
      this.filteredBanks.next(this.dependencias.slice());
      this.bankFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterBanks();
        });
    });
  }
  asignar_funcionario(funcionario: { _id: string, nombre: string, cargo: string, dni: string }) {
    let newLogin: string[] = `${funcionario.nombre}`.split(' ')
    if (newLogin.length >= 2) {
      this.Form_Cuenta.get('login')?.setValue(`${newLogin[0]}${newLogin[1][0]}`)
      this.Form_Cuenta.get('password')?.setValue(funcionario.dni)
    }
    this.Form_Cuenta.get('funcionario')?.setValue(funcionario._id)
  }



  guardar() {
    this.cuentasService.crear_cuenta_asignando(this.Form_Cuenta.value).subscribe(cuenta => {
      crear_hoja_usuarios(cuenta.funcionario.nombre, cuenta.funcionario.cargo, cuenta.dependencia.nombre, cuenta.funcionario.dni, cuenta.dependencia.institucion.sigla, this.Form_Cuenta.get('login')?.value, this.Form_Cuenta.get('password')?.value)
      this.dialogRef.close(cuenta)
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
    if (!this.Funcionarios) {
      return;
    }
    let search = this.userFilterCtrl.value;
    if (!search) {
      this.filteredUsers.next(this.Funcionarios.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredUsers.next(
      this.Funcionarios.filter(user => user.nombre.toLowerCase().indexOf(search) == 0 || user.cargo.toLowerCase().indexOf(search) == 0)
    );
  }

}
