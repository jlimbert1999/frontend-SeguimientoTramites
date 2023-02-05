import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ReportesExternoService } from 'src/app/Reportes/services/reportes-externo.service';
import Swal from 'sweetalert2';
import { ExternosService } from '../../services/externos.service';

@Component({
  selector: 'app-concluidos',
  templateUrl: './concluidos.component.html',
  styleUrls: ['./concluidos.component.css']
})
export class ConcluidosComponent implements OnInit {

  displayedColumns: string[] = ['alterno', 'descripcion', 'estado', 'respon', 'duracion', 'opciones'];
  dataSource: any[] = [];

  constructor(private reporteService: ReportesExternoService, private externoService: ExternosService) { }

  ngOnInit(): void {
    this.reporteService.getConclude().subscribe(data => {

      data.map((tramite: any) => {
        tramite['duracion'] = this.duration(tramite.fecha_registro, tramite.fecha_finalizacion)
        return tramite
      })
      this.dataSource = data

    })
  }

  duration(inicio: any, fin: any) {
    inicio = moment(new Date((inicio)))
    fin = moment(new Date((fin)))
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
    if (duration.seconds() >= 1) {
      const seconds = Math.floor(duration.seconds());
      parts.push(seconds + " " + (seconds > 1 ? "segundos" : "segundo"));
    }
    return parts.join(", ")
  }

  unarchive(tramite: any) {
    Swal.fire({
      icon: 'question',
      title: `Desarchivar el tramite ${tramite.alterno}?`,
      text: `El tramite volvera a estar en revision`,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
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
        this.externoService.unarchive(tramite._id).subscribe(message => {

          this.reporteService.getConclude().subscribe(data => {
            data.map((tramite: any) => {
              tramite['duracion'] = this.duration(tramite.fecha_registro, tramite.fecha_finalizacion)
              return tramite
            })
            this.dataSource = data
          })
        })
      }
    })


  }


}
