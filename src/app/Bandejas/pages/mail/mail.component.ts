import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Interno } from 'src/app/Internos/models/Interno.interface';
import { Externo, WorkflowData } from 'src/app/Externos/models/Externo.interface';
import { ActivatedRoute } from '@angular/router';
import { BandejaEntradaService } from '../../services/bandeja-entrada.service';
import { ExternosService } from 'src/app/Externos/services/externos.service';
import { InternosService } from 'src/app/Internos/services/internos.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { slideInLeftOnEnterAnimation } from 'angular-animations';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
    slideInLeftOnEnterAnimation({ duration: 500 })
  ],

})
export class MailComponent implements OnInit {
  tipo: 'tramites_externos' | 'tramites_internos'
  Tramite: any
  Workflow: WorkflowData[]
  Observaciones: any
  Mail: any
  constructor(
    private _location: Location,
    private activateRoute: ActivatedRoute,
    private entradaService: BandejaEntradaService,
    private externoService: ExternosService,
    private internoService: InternosService,
    private authService: AuthService
  ) {

  }
  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      if (params['id']) {
        this.entradaService.GetDetailsMail(params['id']).subscribe(data => {
          this.Mail = data
          this.tipo = data.tipo
          if (this.tipo === 'tramites_externos') {
            this.externoService.getOne(data.tramite).subscribe(data => {
              this.Tramite = data.tramite
              this.Workflow = data.workflow
              this.Observaciones = data.tramite.observaciones
              console.log(this.Observaciones)
            })
          }
          else {
            this.internoService.GetOne(data.tramite).subscribe(data => {
              this.Tramite = data.tramite
              this.Workflow = data.workflow
            })
          }
        })
      }
    })
  }
  regresar() {
    this._location.back();
  }

  generar() {

  }

  observar() {
    Swal.fire({
      icon: 'question',
      title: `Registrar observacion para el tramite: ${this.Tramite.alterno}?`,
      text: `Debe ingresar una descripcion de la observacion`,
      input: 'textarea',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      customClass: {
        validationMessage: 'my-validation-message'
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> Debe ingresar una referencia para la conclusion'
          )
        }

      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.tipo === 'tramites_externos') {
          this.externoService.addObservacion(result.value!, this.Tramite._id, `${this.authService.Account.funcionario.nombre_completo} (${this.authService.Account.funcionario.cargo})`).subscribe(observaciones => {
            console.log(observaciones)
            this.Observaciones = observaciones
          })
          // this.externoService.addObservacion(result.value, this.id_tramite, `${this.authService.Account.funcionario.nombre_completo} (${this.authService.Account.funcionario.cargo})`).subscribe(observacion => {
          //   this.Me = observacion
          //   this.NewState.emit('OBSERVADO');
          // })

        }
        else if (this.tipo === 'tramites_internos') {
          // this.internoService.addObservacion(result.value, this.id_tramite, `${this.authService.Account.funcionario.nombre_completo} (${this.authService.Account.funcionario.cargo})`).subscribe(observacion => {
          //   this.Me = observacion
          //   this.NewState.emit('OBSERVADO');
          // })
        }
      }
    })

  }

}
