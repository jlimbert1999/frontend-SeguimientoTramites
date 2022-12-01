import { RequerimientoModel } from "./requerimientos";

export interface TiposTramitesModel {
  id_tipoTramite?: string
  nombre: string
  segmento: string
  activo: boolean
  tipo: string
  requerimientos: RequerimientoModel[]
}

