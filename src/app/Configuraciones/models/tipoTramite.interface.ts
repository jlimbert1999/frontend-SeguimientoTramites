

export interface TipoTramite {
    id_tipoTramite: string
    nombre: string
    segmento: string
    activo: boolean
    tipo: string
    requerimientos: Requerimiento[]
}

export interface Requerimiento {
    _id?: string;
    nombre: string;
    activo: boolean;
  }
  
  
