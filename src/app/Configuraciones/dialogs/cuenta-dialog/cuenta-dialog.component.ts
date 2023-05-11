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
import { ReplaySubject, Subject, forkJoin, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { CuentaService } from 'src/app/Configuraciones/services/cuenta.service';
import { Cuenta } from 'src/app/Configuraciones/models/cuenta.interface';
import { HojaUsuarios } from 'src/app/Configuraciones/pdfs/usuarios';
import { RolService } from '../../services/rol.service';



@Component({
  selector: 'app-cuenta-dialog',
  templateUrl: './cuenta-dialog.component.html',
  styleUrls: ['./cuenta-dialog.component.scss'],
})
export class CuentaDialogComponent implements OnInit, OnDestroy {
  dependencias: any[] = [];
  instituciones: any[] = [];
  roles: any[] = []

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
    rol: ['', Validators.required],
    dependencia: ['', Validators.required],
  });





  public bankCtrl: FormControl = new FormControl();
  public bankFilterCtrl: FormControl = new FormControl();
  public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();


  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Cuenta,
    public dialogRef: MatDialogRef<CuentaDialogComponent>,
    private cuentasService: CuentaService,
    private rolService: RolService
  ) { }

  ngOnInit(): void {
    forkJoin([this.cuentasService.getInstituciones(), this.rolService.get()]).subscribe(
      data => {
        this.instituciones = data[0]
        this.roles = data[1]
      }
    )

  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


  guardar() {
    this.cuentasService.add(this.Form_Cuenta.value, this.Form_Funcionario.value).subscribe(cuenta => {
      HojaUsuarios(
        cuenta,
        this.Form_Cuenta.get('login')?.value,
        this.Form_Cuenta.get('password')?.value
      )
      this.dialogRef.close(cuenta)
    })
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











}
