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