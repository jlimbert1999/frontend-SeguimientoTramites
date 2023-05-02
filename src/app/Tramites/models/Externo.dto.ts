export interface SolicitanteDto {
    _id?: string
    nombre: string
    paterno: string
    materno: string
    telefono: string
    tipo: 'NATURAL' | 'JURIDICO'
    dni: string
    expedido: string
    documento: string
}
export interface RepresentanteDto {
    _id?: string
    nombre: string
    paterno: string
    materno: string
    telefono: string
    dni: string
    expedido: string
    documento: string
}
export interface ExternoDto {
    cantidad: string
    detalle: string
    tipo_tramite: string
    alterno: string
    requerimientos: string[]
    cite: string
}
