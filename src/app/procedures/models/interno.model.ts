import { typeProcedure } from "src/app/administration/interfaces/typeProcedure.interface"
import { stateProcedure } from "../interfaces/procedures.interface"
import { account } from "src/app/administration/interfaces/account.interface"

export class InternalDetail {
    static frmJson(obj: any) {
        return new InternalDetail(
            obj['_id'],
            obj['tipo_tramite'],
            obj['cuenta'],
            obj['estado'],
            obj['alterno'],
            obj['detalle'],
            obj['cantidad'],
            new Date(obj['fecha_registro']),
            obj['cite'] !== '' ? obj['cite'] : 'SIN CITE',
            obj['remitente'],
            obj['destinatario'],
            obj['fecha_finalizacion']
        )
    }
    fecha_finalizacion?: Date
    constructor(
        public _id: string,
        public tipo_tramite: typeProcedure,
        public cuenta: account,
        public estado: stateProcedure,
        public alterno: string,
        public detalle: string,
        public cantidad: string,
        public fecha_registro: Date,
        public cite: string,
        public remitente: { nombre: string, cargo: string },
        public destinatario: { nombre: string, cargo: string },
        fecha_finalizacion?: string
    ) {
        if (fecha_finalizacion) this.fecha_finalizacion = new Date(fecha_finalizacion)
    }

    get fullNameManager() {
        if (!this.cuenta.funcionario) return `DESVINCULADO`
        const jobtitle = this.cuenta.funcionario.cargo ? this.cuenta.funcionario.cargo.nombre : ''
        return `${this.cuenta.funcionario.nombre} ${this.cuenta.funcionario.paterno} ${this.cuenta.funcionario.materno} (${jobtitle})`
    }


}