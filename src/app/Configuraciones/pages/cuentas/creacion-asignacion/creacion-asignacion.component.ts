import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Funcionario } from 'src/app/Configuraciones/models/funcionario.interface';
import { HojaUsuarios } from 'src/app/Configuraciones/pdfs/usuarios';
import { CuentaService } from 'src/app/Configuraciones/services/cuenta.service';
import Swal from 'sweetalert2';
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
    { value: 'RECEPCION', viewValue: 'Recepcion de tramites' },
    { value: 'EVALUACION', viewValue: 'Evaluacion de tramites' }
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
    private cuentaService: CuentaService
  ) { }

  ngOnInit(): void {
    this.cuentaService.getInstituciones().subscribe(inst => {
      this.Instituciones = inst
    })
    this.userFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe((value) => {
        if (value !== '') {
          this.cuentaService.getUsersForAssign(value).subscribe(users => {
            this.filteredUsers.next(users)
          })
        }
      });
  }
  
  seleccionar_institucion(id_institucion: string) {
    this.cuentaService.getDependencias(id_institucion).subscribe(dep => {
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
    // this.cuentaService.AddAccountLink(this.Form_Cuenta.value).subscribe(cuenta => {
    //   HojaUsuarios(
    //     cuenta.funcionario!.nombre,
    //     cuenta.funcionario!.paterno,
    //     cuenta.funcionario!.materno,
    //     cuenta.funcionario!.cargo,
    //     cuenta.dependencia.nombre,
    //     cuenta.funcionario!.dni,
    //     cuenta.dependencia.institucion.sigla,
    //     this.Form_Cuenta.get('login')?.value,
    //     this.Form_Cuenta.get('password')?.value
    //   )
    //   this.dialogRef.close(cuenta)
    // })
  }

  selectUserAssign(value: Funcionario) {
    Swal.fire({
      title: `Crear cuenta con funcionario existente?`,
      text: `${value.nombre} ${value.paterno} ${value.materno} (${value.cargo}) sera asignado a la cuenta creaada`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.Form_Cuenta.get('funcionario')?.setValue(value._id)
        this.Form_Cuenta.get('login')?.setValue(`${value.nombre}${value.paterno[0]}${value.materno[0]}`.replace(/\s/g, ''))
        this.Form_Cuenta.get('password')?.setValue(value.dni)
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


}
