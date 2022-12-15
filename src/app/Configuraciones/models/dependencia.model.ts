export interface DependenciaModel {
    id_dependencia?: string
    institucion: string | { _id: string, sigla: string },
    nombre: string,
    sigla: string,
    codigo: string
    activo?: boolean
}
