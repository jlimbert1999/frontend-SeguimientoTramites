import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, filter, map, ReplaySubject, Subject, takeUntil, tap } from 'rxjs';
import { Funcionario } from 'src/app/Configuraciones/models/funcionario.interface';
import { UsuariosService } from 'src/app/Configuraciones/services/usuarios.service';

@Component({
  selector: 'app-usuario-dialog',
  templateUrl: './usuario-dialog.component.html',
  styleUrls: ['./usuario-dialog.component.css']
})
export class UsuarioDialogComponent implements OnInit, OnDestroy {
  titulo: string
  Form_Funcionario: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    paterno: ['', Validators.required],
    materno: [''],
    dni: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.maxLength(8)]],
    cargo: ['', Validators.required],
    direccion: ['', Validators.required],
    superior: [undefined]
  });

  /** list of banks */
  protected funcionarios: any[] = [];

  /** control for filter for server side. */
  public funcionarioServerSideFilteringCtrl: FormControl<any> = new FormControl<string>('');
  /** indicate search operation is in progress */
  public searching = false;
  /** list of banks filtered after simulating server side search */
  public filteredServerSideBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();




  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Funcionario,
    public dialogRef: MatDialogRef<UsuarioDialogComponent>,
    private usuariosService: UsuariosService
  ) { }


  ngOnInit(): void {
    this.funcionarioServerSideFilteringCtrl.valueChanges
      .pipe(
        tap(() => this.searching = true),
        takeUntil(this._onDestroy)
      )
      .subscribe(textValue => {
        if (textValue !== '') {
          this.usuariosService.searchOne(textValue).subscribe(data => {
            this.searching = false;
            this.filteredServerSideBanks.next(data);
          })
        }

      });

    if (this.data) {
      this.titulo = 'Edicion'
      this.Form_Funcionario.patchValue(this.data)
    }
    else {
      this.titulo = 'Registro'
    }
  }

  guardar() {
    if (this.Form_Funcionario.valid) {
      if (this.data) {
        this.usuariosService.edit(this.data._id!, this.Form_Funcionario.value).subscribe(user => {
          this.dialogRef.close(user)
        })
      }
      else {
        this.usuariosService.add(this.Form_Funcionario.value).subscribe(user => {
          this.dialogRef.close(user)
        })
      }

    }
   

  }
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
