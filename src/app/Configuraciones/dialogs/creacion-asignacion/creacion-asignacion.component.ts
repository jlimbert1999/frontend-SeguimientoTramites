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
import { RolService } from '../../services/rol.service';
@Component({
  selector: 'app-creacion-asignacion',
  templateUrl: './creacion-asignacion.component.html',
  styleUrls: ['./creacion-asignacion.component.scss']
})
export class CreacionAsignacionComponent implements OnInit {
  dependencias: { id_dependencia: string, nombre: string }[] = [];
  instituciones: { id_institucion: string, nombre: string }[] = [];
  roles: any[] = []
  Funcionarios: { _id: string, nombre: string, cargo: string, dni: string }[] = []



  Form_Cuenta: FormGroup = this.fb.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
    rol: ['', Validators.required],
    dependencia: ['', Validators.required]
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
    private cuentaService: CuentaService,
    private rolService: RolService
  ) { }

  ngOnInit(): void {
    forkJoin([this.cuentaService.getInstituciones(), this.rolService.get()]).subscribe(
      data => {
        this.instituciones = data[0]
        this.roles = data[1]
      }
    )

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



  guardar() {
    this.cuentaService.addAccountLink(this.Form_Cuenta.value, this.userCtrl.value).subscribe(cuenta => {
      this.dialogRef.close(cuenta)
      HojaUsuarios(
        cuenta,
        this.Form_Cuenta.get('login')?.value,
        this.Form_Cuenta.get('password')?.value
      )

    })
  }

  selectUserAssign(value: Funcionario) {
    this.Form_Cuenta.get('login')?.setValue(`${value.nombre}${value.paterno[0]}${value.materno[0]}`.replace(/\s/g, ''))
    this.Form_Cuenta.get('password')?.setValue(value.dni)
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
