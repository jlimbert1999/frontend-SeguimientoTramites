export interface SolicitanteModel {
    _id: string
    nombre: string
    paterno: string
    materno: string
    telefono: string
    tipo: 'NATURAL' | 'JURIDICO'
    dni: string
    expedido: string
    documento: string
}
export interface RepresentanteModel {
    _id: string
    nombre: string
    telefono: string
    tipo: string
    dni: string
    expedido: string
    documento: string
}