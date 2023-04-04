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
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { CuentaService } from 'src/app/Configuraciones/services/cuenta.service';
import { Cuenta } from 'src/app/Configuraciones/models/cuenta.interface';
import { HojaUsuarios } from 'src/app/Configuraciones/pdfs/usuarios';



@Component({
  selector: 'app-cuenta-dialog',
  templateUrl: './cuenta-dialog.component.html',
  styleUrls: ['./cuenta-dialog.component.css'],
})
export class CuentaDialogComponent implements OnInit, OnDestroy {
  dependencias: any[] = [];
  instituciones: any[] = [];

  Form_Funcionario: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    paterno: ['', Validators.required],
    materno: [''],
    dni: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.maxLength(8)]],
    cargo: ['', Validators.required],
    direccion: ['', Validators.required],
  });

  Form_Cuenta: FormGroup = this.fb.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
    dependencia: ['', Validators.required],
  });

  Form_Roles = this.fb.group({
    EXTERNOS: false,
    INTERNOS: false,
    BANDEJAS: false,
    REPORTES: false,
    BUSQUEDAS: false,
    USUARIOS: false,
    CUENTAS: false,
    DEPENDENCIAS: false,
    INSTITUCIONES: false
  });



  public bankCtrl: FormControl = new FormControl();
  public bankFilterCtrl: FormControl = new FormControl();
  public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();

  Roles = [
    { value: 'RECEPCION', viewValue: 'Encargado de recepcion' },
    { value: 'EVALUACION', viewValue: 'Encargado de evaluacion' },
    { value: 'RRHH', viewValue: 'Encargado de recursos humanos' },
    { value: 'JEFE', viewValue: 'Jefe de unidad' },
  ]




  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Cuenta,
    public dialogRef: MatDialogRef<CuentaDialogComponent>,
    private cuentasService: CuentaService,
  ) { }

  ngOnInit(): void {
    this.cuentasService.getInstituciones().subscribe(inst => {
      this.instituciones = inst
    })
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


  guardar() {
    let rol: string[] = []
    for (const [key, value] of Object.entries(this.Form_Roles.value)) {
      if (value) {
        rol.push(key)
      }
    }
    if (rol.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No se ha seleccionado ningun rol',
        text: 'La cuenta no tiene acceso a ningun modulo'
      })
    }
    else {
      this.cuentasService.add({ rol, ...this.Form_Cuenta.value }, this.Form_Funcionario.value).subscribe(cuenta => {
        HojaUsuarios(
          cuenta.funcionario!.nombre,
          cuenta.funcionario!.paterno,
          cuenta.funcionario!.materno,
          cuenta.funcionario!.cargo,
          cuenta.dependencia.nombre,
          cuenta.funcionario!.dni,
          cuenta.dependencia.institucion.sigla,
          cuenta.login,
          this.Form_Cuenta.get('password')?.value
        )
        this.dialogRef.close(cuenta)
      })
    }
  }



  selectInstitucion(id_institucion: string) {
    this.cuentasService.getDependencias(id_institucion).subscribe(dep => {
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

  selectRole(rol: string) {
    switch (rol) {
      case 'RECEPCION':
        this.Form_Roles.setValue({
          'EXTERNOS': true,
          'INTERNOS': true,
          'BANDEJAS': true,
          'REPORTES': true,
          'BUSQUEDAS': false,
          'USUARIOS': false,
          'CUENTAS': false,
          'DEPENDENCIAS': false,
          'INSTITUCIONES': false,
        })
        break;
      case 'EVALUACION':
        this.Form_Roles.patchValue({
          'EXTERNOS': false,
          'INTERNOS': true,
          'BANDEJAS': true,
          'REPORTES': true,
          'BUSQUEDAS': false,
          'USUARIOS': false,
          'CUENTAS': false,
          'DEPENDENCIAS': false,
          'INSTITUCIONES': false,
        })
        break;
      case 'JEFE':
        this.Form_Roles.patchValue({
          'EXTERNOS': false,
          'INTERNOS': true,
          'BANDEJAS': true,
          'REPORTES': true,
          'BUSQUEDAS': true,
          'USUARIOS': false,
          'CUENTAS': false,
          'DEPENDENCIAS': false,
          'INSTITUCIONES': false,
        })
        break;
      case 'RRHH':
        this.Form_Roles.patchValue({
          'EXTERNOS': false,
          'INTERNOS': false,
          'BANDEJAS': false,
          'REPORTES': false,
          'BUSQUEDAS': false,
          'USUARIOS': true,
          'CUENTAS': false,
          'DEPENDENCIAS': false,
          'INSTITUCIONES': false,
        })
        break;
      default:
        break;
    }
  }








}
