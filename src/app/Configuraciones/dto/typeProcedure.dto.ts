class TypeProcedureDto {
    nombre: string;
    segmento: string;
    requerimientos: { nombre: string }[];
    constructor({ nombre, segmento, requerimientos }: any) {
        this.nombre = nombre
        this.segmento = segmento
        this.requerimientos = requerimientos
    }
}

export class CreateTypeProcedureDto extends TypeProcedureDto {
    tipo: string;
    constructor({ tipo, ...values }: any) {
        super(values);
        this.tipo = tipo
    }
}

export class UpdateTypeProcedureDto extends TypeProcedureDto {
}


