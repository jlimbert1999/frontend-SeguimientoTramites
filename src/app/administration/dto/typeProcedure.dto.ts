

export class CreateTypeProcedureDto {
    static typeProdecureFromJson(obj: any, requeriments: { nombre: string, activo: boolean }[]) {
        return new CreateTypeProcedureDto(
            obj['nombre'],
            obj['segmento'],
            obj['tipo'],
            requeriments
        )
    }
    constructor(
        public nombre: string,
        public segmento: string,
        public tipo: string,
        public requerimientos: { nombre: string, activo: boolean }[]
    ) {

    }
}

export class UpdateTypeProcedureDto {
    static typeProdecureFromJson(obj: any, requeriments: { nombre: string, activo: boolean }[]) {
        requeriments = requeriments.map(el => ({ nombre: el.nombre, activo: el.activo }))
        return new UpdateTypeProcedureDto(
            obj['nombre'],
            obj['segmento'],
            requeriments
        )
    }
    constructor(
        public nombre: string,
        public segmento: string,
        public requerimientos: { nombre: string, activo: boolean }[]
    ) {
    }
}


