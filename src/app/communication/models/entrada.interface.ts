export interface Entrada {
    _id: string;
    tramite: {
        _id:string
        estado: string;
        alterno: string;
        detalle: string;
    };
    emisor: {
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
    recibido?: boolean;
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
    recibido?: boolean;
}

export interface ImboxData {
    _id: string;
    tipo: 'tramites_externos' | 'tramites_internos';
    tramite: {
        alterno: string;
        cantidad: string;
    };
}

export interface AccountForSend {
    _id: string;
    funcionario: {
        _id: string;
        nombre: string,
        paterno: string,
        materno: string,
        cargo: string,
        fullname: string
    }
    online?: boolean,
}