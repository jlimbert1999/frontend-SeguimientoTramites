// export interface Salida {
//     _id: string
//     tramite: {
//         _id: string
//         estado: string
//         alterno: string
//         detalle: string
//     };
//     receptor: {
//         _id: string
//         dependencia: {
//             nombre: string
//             institucion: {
//                 sigla: string
//             };
//         };
//         funcionario: {
//             _id: string
//             nombre: string
//             paterno: string
//             materno: string
//             cargo: string
//         };
//     };
//     tipo: 'tramites_externos' | 'tramites_internos';
//     emisor: string;
//     motivo: string;
//     cantidad: string;
//     fecha_envio: Date;
//     recibido: boolean;
// }
export interface Salida {
    _id: string
    tramite: string
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


export interface GroupedMails {
    _id: {
        cuenta: string
        fecha_envio: Date
        tipo: "tramites_internos" | "tramites_externos"
        tramite: {
            _id: string
            alterno: string,
            estado: string
            tipo_tramite: {
                nombre: string
            }
        }
    }
    sendings: Salida[]

}