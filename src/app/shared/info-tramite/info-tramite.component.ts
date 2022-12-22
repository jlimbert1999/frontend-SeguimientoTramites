import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InfoExterno } from 'src/app/Tramites/models/externo.model';
import { ExternosService } from 'src/app/Tramites/services/externos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-info-tramite',
  templateUrl: './info-tramite.component.html',
  styleUrls: ['./info-tramite.component.css']
})
export class InfoTramiteComponent implements OnInit {
  @Input() Tramite: InfoExterno

  // SABER SI SE ABRE PARA VER INFORMACION O PARA ADMINISTRAR
  @Input() permitir_opciones: boolean

  // SI ESTA RECIBIDO AGREGA OBSERVACIONES
  @Input() recibido: boolean


  @ViewChild(MatAccordion) accordion: MatAccordion;
  Mis_observaciones: { id_cuenta: string, funcionario: string, fecha: string, corregido: boolean, descripcion: string }
  Otras_observaciones: { id_cuenta: string, funcionario: string, fecha: string, corregido: boolean, descripcion: string }[] = []

  constructor(private externoService: ExternosService, private authService: AuthService) { }

  ngOnInit(): void {
    this.Tramite.observaciones.forEach((obs: any) => {
      if (obs.id_cuenta === this.authService.Detalles_Cuenta.id_cuenta) {
        this.Mis_observaciones = obs
      }
      else {
        this.Otras_observaciones.push(obs)
      }
    });
  }

  addObservacion() {
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
          this.externoService.addObservacion(result.value, this.Tramite._id, `${this.authService.Detalles_Cuenta.funcionario} (${this.authService.Detalles_Cuenta.cargo})`).subscribe(data => {
            this.Tramite.estado = data.estado
            this.Mis_observaciones = data.observacion
          })
        }
      }
    })
  }
  putObservacion() {
    this.externoService.putObservacion(this.Tramite._id).subscribe(newEstado => {
      this.Mis_observaciones.corregido = true
      this.Tramite.estado = newEstado
    })
  }


  get permitir_observar() {
    if (this.Mis_observaciones || !this.recibido) {
      return true
    }
    return false
  }



}
