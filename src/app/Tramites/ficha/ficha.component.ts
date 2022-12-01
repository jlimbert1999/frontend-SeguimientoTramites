import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TramiteService } from '../services/tramite.service';
import * as moment from 'moment';
import * as shape from 'd3-shape';

@Component({
  selector: 'app-ficha',
  templateUrl: './ficha.component.html',
  styleUrls: ['./ficha.component.css']
})
export class FichaComponent implements OnInit {
  Tramite: any
  Solicitante: any
  Representante: any
  nodos: any[] = []
  links: any[] = []
  clusters: { id: string, label: string, childNodeIds: string[] }[] = []
  curve: any = shape.curveMonotoneX;
  constructor(
    private activateRoute: ActivatedRoute,
    private tramiteService: TramiteService
    // private _location: Location
  ) {
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      if (params['id']) {
        this.tramiteService.obtener_tramite_externo(params['id']).subscribe(data => {
          console.log(data)
          this.Solicitante = data.tramite.solicitante
          this.Representante = data.tramite.representante

          this.Tramite = data.tramite
          this.crear_Nodos(data.workflow)
          this.crear_Vinculos(data.workflow)
        })

      }
    })
  }

  crear_Nodos(workflow: any[]) {
    let aux: any
    let fecha_inicio: any, fecha_fin: any
    workflow.forEach((cuenta, index: number) => {


      let findUserEmi = this.nodos.find(nodo => nodo.id === cuenta.cuenta_emisor._id);
      if (!findUserEmi) {
        aux = {
          id: cuenta.cuenta_emisor._id.toString(),
          label: `funcionario-${cuenta.cuenta_emisor._id}`,
          data: {
            Nombre: cuenta.funcionario_emisor.funcionario.nombre,
            NombreCar: cuenta.funcionario_emisor.cargo,
            NombreDep: cuenta.cuenta_emisor.dependencia.nombre,
          },
          position: `x${index}`
        }
        this.nodos.push(aux)

      }

      let findUserRecept = this.nodos.find(nodo => nodo.id === cuenta.cuenta_receptor._id);
      if (!findUserRecept) {
        aux = {
          id: cuenta.cuenta_receptor._id.toString(),
          label: `funcionario-${cuenta.cuenta_emisor._id}`,
          data: {
            Nombre: cuenta.funcionario_receptor.funcionario.nombre,
            NombreCar: cuenta.funcionario_receptor.cargo,
            NombreDep: cuenta.cuenta_receptor.dependencia.nombre
            // Sigla: funcionario.sigla
          },
          position: `x${index}`

        }
        this.nodos.push(aux)
      }
    })
    console.log(this.nodos)

  }
  crear_Vinculos(workflow: any[]) {
    this.nodos.forEach((element: any) => {
      workflow.forEach((flujo: any, index: number) => {

        if (element.id == flujo.cuenta_emisor._id) {
          let aux = {
            id: `a${index}`,
            source: element.id,
            target: flujo.cuenta_receptor._id.toString(),
            label: `${index + 1}`,
            completado: ''
          }
          if (flujo.aceptado == true && flujo.rechazado == false && flujo.reeenviado == false) {
            aux.label = `${aux.label}-Pendiente`
            aux.completado = 'pendiente'
          }
          else if (flujo.rechazado == true) {
            aux.label = `${aux.label}-Rechazado`
            aux.completado = 'rechazado'
          }

          this.links.push(aux)
        }
      })
    })
  }
  crear_duracion(inicio: any, fin: any) {

    let parts: any = [];
    let duration = moment.duration(fin.diff(inicio))
    if (duration.years() >= 1) {
      const years = Math.floor(duration.years());
      parts.push(years + " " + (years > 1 ? "años" : "año"));
    }
    if (duration.months() >= 1) {
      const months = Math.floor(duration.months());
      parts.push(months + " " + (months > 1 ? "meses" : "mes"));
    }

    if (duration.days() >= 1) {
      const days = Math.floor(duration.days());
      parts.push(days + " " + (days > 1 ? "dias" : "dia"));
    }

    if (duration.hours() >= 1) {
      const hours = Math.floor(duration.hours());
      parts.push(hours + " " + (hours > 1 ? "horas" : "hora"));
    }

    if (duration.minutes() >= 1) {
      const minutes = Math.floor(duration.minutes());
      parts.push(minutes + " " + (minutes > 1 ? "minutos" : "minuto"));
    }
    else {
      const seconds = Math.floor(duration.seconds());
      parts.push(seconds + " " + (seconds > 1 ? "segundos" : "segundo"));
    }

    // if (duration.seconds() >= 1) {
    //   const seconds = Math.floor(duration.seconds());
    //   parts.push(seconds + " " + (seconds > 1 ? "seconds" : "second"));
    // }
    return parts.join(", ")
  }




}
