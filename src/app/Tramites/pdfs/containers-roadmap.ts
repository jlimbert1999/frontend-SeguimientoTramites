import { WorkflowData } from "src/app/Bandejas/models/workflow.interface";
import * as moment from "moment-timezone";
moment.tz.setDefault("America/La_Paz")

interface RoadMap {
    remitente: {
        nombre_completo: string
        cargo: string
    }
    sends: {
        destinatario: {
            nombre_completo: string
            cargo: string
        }
        entrada: [string, string, string]
        salida: [string, string, string, string, string]
    }[]
}
export function createRoadMapData(workflow: WorkflowData[]): RoadMap[] {
    const merged = workflow.reduce((r: any, { tramite, emisor, fecha_envio, motivo, numero_interno, cantidad, ...rest }, index) => {
        const key = `${tramite}-${emisor.cuenta._id}-${fecha_envio}`;
        r[key] = r[key] || { remitente: { nombre_completo: createFullName(emisor.funcionario), cargo: emisor.funcionario.cargo }, sends: [] };
        let salida: [string, string, string, string, string] = ['', '', '', '', '']
        for (let j = index; j < workflow.length; j++) {
            if (rest.receptor.cuenta._id === workflow[j].emisor.cuenta._id) {
                salida = [workflow[j].motivo, moment(workflow[j].fecha_envio).format('DD-MM-YYYY'), moment(workflow[j].fecha_envio).format('HH:mm A'), workflow[j].cantidad, workflow[j].numero_interno]
                break
            }
        }
        r[key]["sends"].push({ destinatario: { nombre_completo: createFullName(rest.receptor.funcionario), cargo: rest.receptor.funcionario.cargo }, entrada: rest.fecha_recibido ? [moment(rest.fecha_recibido).format('DD-MM-YYYY'), moment(rest.fecha_recibido).format('HH:mm A'), cantidad] : ['', '', ''], salida })
        return r;
    }, {})
    return Object.values(merged)
}
export function createFullName(person: { nombre: string, paterno: string, materno: string }): string {
    return [person.nombre, person.paterno, person.paterno].filter(Boolean).join(" ");
}
