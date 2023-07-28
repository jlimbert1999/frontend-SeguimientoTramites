export interface newWorkflow {
    _id: {
        cuenta: string;
        tipo: string;
        fecha_envio: string;
    };
    sendings: sending[];
}

export interface sending {
    _id: string;
    emisor: participant;
    receptor: participant;
    tramite: string;
    tipo: string;
    motivo: string;
    cantidad: string;
    fecha_envio: string;
    numero_interno: string;
    fecha_recibido: string;
    recibido: boolean;
}

export interface participant {
    cuenta: Cuenta;
    fullname: string;
    jobtitle?: string;
}

export interface Cuenta {
    _id: string;
    dependencia: Dependencia;
}

export interface Dependencia {
    _id: string;
    nombre: string;
    institucion: Institucion;
}

export interface Institucion {
    _id: string;
    nombre: string;
}
