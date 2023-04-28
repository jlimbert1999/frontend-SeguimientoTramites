import * as moment from "moment";
import { ListWorkflow, WorkflowData } from "../models/workflow.interface";

export function createListWorkflow(data: WorkflowData[], rootAccounts: { id_root: string, startDate: string }[], list: ListWorkflow[]) {
  rootAccounts.forEach(root => {
    const firstShipment = data.find(mail => mail.emisor.cuenta._id === root.id_root)
    if (firstShipment) {
      const remainingShipments = data.filter(mail => mail.emisor.cuenta._id === root.id_root && mail.fecha_envio === firstShipment.fecha_envio)
      data = data.filter(mail => mail.emisor.cuenta._id !== root.id_root && mail.fecha_envio !== firstShipment.fecha_envio)
      list.push({
        officer: {
          fullname: createFullName(firstShipment.emisor.funcionario),
          jobtitle: firstShipment.emisor.funcionario.cargo,
        },
        shippigDate: firstShipment.fecha_envio,
        adjunt: firstShipment.cantidad,
        duration: createDuration(root.startDate, firstShipment.fecha_envio),
        workUnit: firstShipment.emisor.cuenta.dependencia.nombre,
        workInstitution: firstShipment.emisor.cuenta.dependencia.institucion.sigla,
        reference: firstShipment.motivo,
        sends: remainingShipments.map(({ receptor, fecha_envio, fecha_recibido, motivo_rechazo, recibido }) => ({
          officer: {
            fullname: createFullName(receptor.funcionario),
            jobtitle: receptor.funcionario.cargo,
          },
          received: recibido,
          receivedDate: fecha_recibido || '',
          rejectReason: motivo_rechazo || '',
          duration: createDuration(fecha_envio, fecha_recibido),
          workUnit: receptor.cuenta.dependencia.nombre,
          workInstitution: receptor.cuenta.dependencia.institucion.sigla,
        }))
      })
      rootAccounts = remainingShipments.map(ele => ({ id_root: ele.receptor.cuenta._id, startDate: ele.fecha_recibido! }))
      createListWorkflow(data, rootAccounts, list)
    }
  })
  return list
}


export function createDuration(inicio: any, fin: any) {
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

function createFullName(account: { nombre: string, paterno: string, materno: string }): string {
  return `${account.nombre} ${account.paterno} ${account.materno}`
}

