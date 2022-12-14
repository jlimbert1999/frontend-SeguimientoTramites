import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, ReplaySubject, startWith, Subject, take, takeUntil } from 'rxjs';
import { CuentaModel, CuentaData } from '../../models/cuenta.mode';
import { UsuarioModel } from '../../models/usuario.model';
import { CuentaService } from '../../services/cuenta.service';
import Swal from 'sweetalert2';
import { crear_hoja_usuarios } from 'src/app/generacion_pdfs/usuario';
import { MatSelect } from '@angular/material/select';
import { InstitucionModel } from '../../models/institucion.model';
import { DependenciaModel } from '../../models/dependencia.model';

@Component({
  selector: 'app-cuenta-dialog',
  templateUrl: './cuenta-dialog.component.html',
  styleUrls: ['./cuenta-dialog.component.css'],
})
export class CuentaDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  titulo: string = '';
  dependencias: { id_dependencia: string, nombre: string }[] = [];
  Instituciones: { id_institucion: string, nombre: string }[] = [];
  cambiar_password: boolean = false;
  Form_Funcionario: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    paterno: ['', Validators.required],
    materno: [''],
    expedido: ['', Validators.required],
    dni: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.maxLength(8)]],
    cargo: ['', Validators.required],
    direccion: ['', Validators.required],
  });

  Form_Cuenta: FormGroup = this.fb.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
    rol: ['', Validators.required],
    dependencia: ['', Validators.required],
  });

  displayedColumns = ['nombre', 'cargo', 'dni', 'opciones'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  public bankCtrl: FormControl = new FormControl();
  public bankFilterCtrl: FormControl = new FormControl();
  public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('singleSelect') singleSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  Roles = [
    { value: 'RECEPCION', viewValue: 'Recepcion de tramites' },
    { value: 'EVALUACION', viewValue: 'Evaluacion de tramites' }
  ]
  departamentos = [
    'COCHABAMBA',
    'SANTA CRUZ',
    'LA PAZ',
    'ORURO',
    'PANDO',
    'BENI',
    'CHUQUISACA',
    'TARIJA',
    'POTOSI'
  ]


  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: CuentaData,
    public dialogRef: MatDialogRef<CuentaDialogComponent>,
    private cuentasService: CuentaService
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.titulo = 'Edicion';
      this.Form_Cuenta = this.fb.group({
        login: [this.data.login, Validators.required],
        rol: [this.data.rol, Validators.required]
      });
    } else {
      this.titulo = 'Registro';
      this.cuentasService.obtener_instituciones_hablitadas().subscribe(inst => {
        this.Instituciones = inst
      })

    }
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


  guardar() {
    if (this.data) {
      this.cuentasService
        .editar_cuenta(this.data._id, this.Form_Cuenta.value)
        .subscribe(cuenta => {
          crear_hoja_usuarios(this.data.funcionario.nombre, this.data.funcionario.paterno, this.data.funcionario.materno, this.data.funcionario.cargo, this.data.dependencia.nombre, this.data.funcionario.dni, this.data.dependencia.institucion.sigla, this.Form_Cuenta.get('login')?.value, this.Form_Cuenta.get('password')?.value)
          this.dialogRef.close(cuenta);
        });
    } else {
      this.cuentasService.agregar_cuenta(this.Form_Cuenta.value, this.Form_Funcionario.value).subscribe(cuenta => {
        this.dialogRef.close(cuenta);
        crear_hoja_usuarios(cuenta.funcionario.nombre, cuenta.funcionario.paterno, cuenta.funcionario.materno, cuenta.funcionario.cargo, cuenta.dependencia.nombre, cuenta.funcionario.dni, cuenta.dependencia.institucion.sigla, cuenta.login, this.Form_Cuenta.get('password')?.value)
      });
    }
  }

  cambiar_formulario(value: boolean) {
    this.cambiar_password = value;
    if (value) {
      this.Form_Cuenta = this.fb.group({
        login: [this.data.login, Validators.required],
        password: [this.data.funcionario.dni, Validators.required],
        rol: [this.data.rol, Validators.required],
      });
    } else {
      this.Form_Cuenta = this.fb.group({
        login: [this.data.login, Validators.required],
        rol: [this.data.rol, Validators.required]
      });
    }
  }
  obtener_funcionarios() {
    this.cuentasService.obtener_funcionarios_asignacion().subscribe((users) => {
      this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
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
  generar_credenciales() {
    let name = this.Form_Funcionario.get('nombre')?.value.split(' ')[0]
    let firstName = this.Form_Funcionario.get('paterno')?.value[0] ? this.Form_Funcionario.get('paterno')?.value[0] : ''
    let lasttName = this.Form_Funcionario.get('materno')?.value[0] ? this.Form_Funcionario.get('materno')?.value[0] : ''
    this.Form_Cuenta.get('login')?.setValue(name + firstName + lasttName)
    this.Form_Cuenta.get('password')?.setValue(this.Form_Funcionario.get('dni')?.value)
  }
  ngAfterViewInit() {
    // this.setInitialValue();
  }
  protected filterBanks() {
    if (!this.dependencias) {
      return;
    }
    // get the search keyword
    let search = this.bankFilterCtrl.value;
    if (!search) {
      this.filteredBanks.next(this.dependencias.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanks.next(
      this.dependencias.filter(bank => bank.nombre.toLowerCase().indexOf(search) > -1)
    );
  }
  protected setInitialValue() {
    this.filteredBanks
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: any, b: any) => a && b && a.id_dependencia === b.id_dependencia;
      });
  }






}
