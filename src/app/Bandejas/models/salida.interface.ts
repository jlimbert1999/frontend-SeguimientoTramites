export interface Salida {
    _id: string
    tramite: {
        _id: string
        estado: string
        alterno: string
        detalle: string
    };
    receptor: {
        _id: string
        dependencia: {
            nombre: string
            institucion: {
                sigla: string
            };
        };
        funcionario: {
            _id: string
            nombre: string
            paterno: string
            materno: string
            cargo: string
        };
    };
    tipo: 'tramites_externos' | 'tramites_internos';
    emisor: string;
    motivo: string;
    cantidad: string;
    fecha_envio: Date;
    recibido: boolean;
}