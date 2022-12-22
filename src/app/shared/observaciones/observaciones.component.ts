import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Observacion } from 'src/app/Tramites/models/mail.model';
import { ExternosService } from 'src/app/Tramites/services/externos.service';
import { InternosService } from 'src/app/Tramites/services/internos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-observaciones',
  templateUrl: './observaciones.component.html',
  styleUrls: ['./observaciones.component.css']
})
export class ObservacionesComponent implements OnInit {
  @Input() Observaciones: any[] = []
  @Input() Options: boolean
  @Input() id_tramite: string
  @Input() type: 'tramites_externos' | 'tramites_internos'
  @Input() recibido: boolean
  @Output() NewState = new EventEmitter<string>();

  Me: Observacion
  Others: Observacion[] = []

  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(
    private authService: AuthService,
    private externoService: ExternosService,
    private internoService: InternosService
  ) { }
  ngOnInit(): void {
    if (this.Options) {
      this.Observaciones.forEach((obs: any) => {
        if (obs.id_cuenta === this.authService.Detalles_Cuenta.id_cuenta) {
          this.Me = obs
        }
        else {
          this.Others.push(obs)
        }
      });
    }
  }
  add() {
    Swal.fire({
      title: `Registro observacion`,
      text: 'Ingrese la observacion',
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#38B000',
      cancelButtonColor: '#F94144',
      icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        if (!result.value) {
          Swal.fire({
            title: `Debe ingresar la obsevacion`,
            icon: 'warning'
          })
        }
        else {
          if (this.type === 'tramites_externos') {
            this.externoService.addObservacion(result.value, this.id_tramite, `${this.authService.Detalles_Cuenta.funcionario} (${this.authService.Detalles_Cuenta.cargo})`).subscribe(observacion => {
              this.Me = observacion
              this.NewState.emit('OBSERVADO');
            })

          }
          else if (this.type === 'tramites_internos') {
            this.internoService.addObservacion(result.value, this.id_tramite, `${this.authService.Detalles_Cuenta.funcionario} (${this.authService.Detalles_Cuenta.cargo})`).subscribe(observacion => {
              this.Me = observacion
              this.NewState.emit('OBSERVADO');
            })
          }
        }
      }
    })
  }
  repair() {
    if (this.type === 'tramites_externos') {
      this.externoService.putObservacion(this.id_tramite).subscribe(state => {
        this.Me.corregido = true
        this.NewState.emit(state);
      })

    }
    else if (this.type === 'tramites_internos') {
      this.internoService.putObservacion(this.id_tramite).subscribe(state => {
        this.Me.corregido = true
        this.NewState.emit(state)
      })
    }
  }

  get denied_register() {
    if (this.recibido && !this.Me) {
      return false
    }
    return true
  }

}
