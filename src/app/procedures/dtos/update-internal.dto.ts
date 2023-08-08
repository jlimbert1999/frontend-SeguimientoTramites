import { Person } from "./create-internal.dto"

export class UpdateInternalProcedureDto {
    static fromForm(FormProcedure: any) {
        const emitter = {
            nombre: FormProcedure['nombre_remitente'],
            cargo: FormProcedure['cargo_remitente'],
        }
        const receiver = {
            nombre: FormProcedure['nombre_destinatario'],
            cargo: FormProcedure['cargo_destinatario'],
        }
        return new UpdateInternalProcedureDto(
            emitter,
            receiver,
            FormProcedure['detalle'],
            FormProcedure['cantidad'],
            FormProcedure['cite'],
        )
    }
    constructor(
        public remitente: Person,
        public destinatario: Person,
        public detalle: string,
        public cantidad: string,
        public cite: string
    ) {
    }
}