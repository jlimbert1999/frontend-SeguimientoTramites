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