export class CreateInternalProcedureDto {
    static fromForm(FormProcedure: any) {
        const emitter = {
            nombre: FormProcedure['nombre_remitente'],
            cargo: FormProcedure['cargo_remitente'],
        }
        const receiver = {
            nombre: FormProcedure['nombre_destinatario'],
            cargo: FormProcedure['cargo_destinatario'],
        }
        return new CreateInternalProcedureDto(
            FormProcedure['tipo_tramite'],
            emitter,
            receiver,
            FormProcedure['detalle'],
            FormProcedure['cantidad'],
            FormProcedure['cite'],
        )
    }
    constructor(
        public tipo_tramite: string,
        public remitente: Person,
        public destinatario: Person,
        public detalle: string,
        public cantidad: string,
        public cite: string
    ) {

    }
}

export class Person {
    nombre: string;
    cargo: string;
}

