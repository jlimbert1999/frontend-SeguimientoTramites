export interface detailExternalProcedure {
    tipo_tramite: TipoTramite;
    solicitante: Solicitante;
    cuenta: Cuenta;
    estado: string;
    alterno: string;
    pin: number;
    detalle: string;
    cantidad: string;
    requerimientos: any[];
    cite: string;
    enviado: boolean;
    fecha_registro: string;
    // observaciones: any[];
}

export interface Cuenta {
    _id: string;
    funcionario: Funcionario;
}

export interface Funcionario {
    _id: string;
    nombre: string;
    paterno: string;
    materno: string;
    cargo: string;
}

export interface Solicitante {
    nombre: string;
    telefono: string;
    tipo: string;
}

export interface TipoTramite {
    _id: string;
    nombre: string;
}
