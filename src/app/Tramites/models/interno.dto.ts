export interface InternoDto {
    tipo_tramite: string
    detalle: string
    cite: string
    cantidad: string
    remitente: {
        nombre: string
        cargo: string
    },
    destinatario: {
        nombre: string
        cargo: string
    }
}