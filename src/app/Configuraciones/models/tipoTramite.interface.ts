import { Requerimiento } from "./requerimiento.dto";

export interface TipoTramite {
    id_tipoTramite: string
    nombre: string
    segmento: string
    activo: boolean
    tipo: string
    requerimientos: Requerimiento[]
}

