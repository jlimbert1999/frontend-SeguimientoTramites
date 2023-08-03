import { typeProcedure } from "src/app/administration/interfaces/typeProcedure.interface"
import { applicant, representative } from "../interfaces/external.interface"
import { stateProcedure } from "../interfaces/procedures.interfac"
import { account } from "src/app/administration/interfaces/account.interface"

export class ExternalDetail {
    static frmJson(obj: any) {
        return new ExternalDetail(
            obj['_id'],
            obj['tipo_tramite'],
            obj['cuenta'],
            obj['estado'],
            obj['alterno'],
            obj['pin'],
            obj['detalle'],
            obj['cantidad'],
            new Date(obj['fecha_registro']),
            obj['cite'] !== '' ? obj['cite'] : 'SIN CITE',
            obj['solicitante'],
            obj['requerimientos'],
            obj['representante'],
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
        public pin: number,
        public detalle: string,
        public cantidad: string,
        public fecha_registro: Date,
        public cite: string,
        public solicitante: applicant,
        public requerimientos: string[],
        public representante?: representative,
        fecha_finalizacion?: string
    ) {
        if (fecha_finalizacion) this.fecha_finalizacion = new Date(fecha_finalizacion)
    }
    get fullNameApplicant() {
        return this.solicitante.tipo === 'NATURAL'
            ? [this.solicitante.nombre, this.solicitante.paterno, this.solicitante.paterno].filter(Boolean).join(" ")
            : this.solicitante.nombre
    }
    get fullNameManager() {
        if (!this.cuenta.funcionario) return `DESVINCULADO`
        const jobtitle = this.cuenta.funcionario.cargo ? this.cuenta.funcionario.cargo.nombre : ''
        return `${this.cuenta.funcionario.nombre} ${this.cuenta.funcionario.paterno} ${this.cuenta.funcionario.materno} (${jobtitle})`
    }

    get fullNameRepresentative() {
        if (!this.representante) return 'SIN REPRESENTANTE';
        return [this.representante.nombre, this.representante.paterno, this.representante.paterno].filter(Boolean).join(" ")
    }

}