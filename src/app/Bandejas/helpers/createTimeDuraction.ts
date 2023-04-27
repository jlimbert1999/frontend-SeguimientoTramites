import * as moment from "moment";
import { ListWorkflow, WorkflowData } from "../models/workflow.interface";

export function createListWorkflow(data: WorkflowData[], rootAccounts: { id_root: string, startDate: string }[], list: ListWorkflow[]) {
  rootAccounts.forEach(root => {
    const rootMail = data.find(mail => mail.emisor.cuenta._id === root.id_root)
    if (rootMail) {
      const send = data.filter(mail => mail.emisor.cuenta._id === root.id_root && mail.fecha_envio === rootMail.fecha_envio)
      data = data.filter(mail => mail.emisor.cuenta._id !== root.id_root && mail.fecha_envio !== rootMail.fecha_envio)
      list.push({
        officer: {
          fullname: createFullName(rootMail.emisor.funcionario),
          jobtitle: rootMail.emisor.funcionario.cargo,
        },
        shippigDate: rootMail.fecha_envio,
        adjunt: rootMail.cantidad,
        duration: crearDuracion(root.startDate, rootMail.fecha_envio),
        workUnit: rootMail.emisor.cuenta.dependencia.nombre,
        workInstitution: rootMail.emisor.cuenta.dependencia.institucion.sigla,
        reference: rootMail.motivo,
        sends: send.map(mail => ({
          officer: {
            fullname: createFullName(mail.receptor.funcionario),
            jobtitle: mail.receptor.funcionario.cargo,
          },
          received: mail.recibido,
          receivedDate: mail.fecha_recibido,
          duration: crearDuracion(mail.fecha_envio, mail.fecha_recibido),
          workUnit: mail.receptor.cuenta.dependencia.nombre,
          workInstitution: mail.receptor.cuenta.dependencia.institucion.sigla,
        }))
      })
      rootAccounts = send.map(ele => ({ id_root: ele.receptor.cuenta._id, startDate: ele.fecha_recibido! }))
      createListWorkflow(data, rootAccounts, list)
    }
  })
  return list
}


export function crearDuracion(inicio: any, fin: any) {
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

