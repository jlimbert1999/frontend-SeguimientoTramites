export interface Entrada {
    _id: string;
    tramite: {
        _id: string;
        tipo_tramite: {
            nombre: string;
        };
        estado: string;
        alterno: string;
        detalle: string;
    };
    emisor: {
        _id: string;
        dependencia: {
            nombre: string;
            institucion: {
                sigla: string;
            };
        };
        funcionario: {
            _id: string;
            nombre: string;
            paterno: string;
            materno: string;
            cargo: string;
        };
    };
    tipo: 'tramites_externos' | 'tramites_internos';
    motivo: string;
    cantidad: string;
    fecha_envio: Date;
    recibido: boolean;
}

export interface Mail {
    _id: string;
    tramite: string
    emisor: {
        cuenta: {
            _id: string;
            dependencia: {
                nombre: string;
                institucion: {
                    sigla: string;
                };
            };
        }

        funcionario: {
            nombre: string;
            paterno: string;
            materno: string;
            cargo: string;
        };
    };
    tipo: 'tramites_externos' | 'tramites_internos';
    motivo: string;
    cantidad: string;
    fecha_envio: Date;
    recibido: boolean;
}