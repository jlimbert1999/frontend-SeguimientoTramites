// export interface Interno {
//     tipo_tramite: string
//     detalle: string
//     cite: string
//     cantidad: string
//     remitente: {
//         nombre: string
//         cargo: string
//     },
//     destinatario: {
//         nombre: string
//         cargo: string
//     }
// }

// export interface InternoData {
//     _id: string
//     remitente: {
//         nombre: string
//         cargo: string
//     },
//     destinatario: {
//         nombre: string
//         cargo: string
//     }
//     tipo_tramite: { nombre: string }
//     alterno: string
//     cuenta: string
//     ubicacion: string
//     detalle: string
//     cite: string
//     cantidad: string
//     fecha_registro: string
//     fecha_finalizacion?: string
//     estado: string
// }

// export interface AllInfoOneInterno {
//     _id: string
//     remitente: {
//         nombre: string
//         cargo: string
//     },
//     destinatario: {
//         nombre: string
//         cargo: string
//     }
//     tipo_tramite: { nombre: string }
//     alterno: string
//     cuenta: string
//     ubicacion: {
//         _id: string
//         dependencia: { nombre: string, institucion: { sigla: string } },
//         funcionario: {
//             nombre: string,
//             paterno: string,
//             materno: string,
//             cargo: string
//         }
//     }
//     detalle: string
//     cite: string
//     cantidad: string
//     fecha_registro: string
//     fecha_finalizacion?: string
//     estado: string
//     observaciones: any[]
//     detalle_conclusion?: string
// }