export interface GroupedResponse {
  _id: {
    cuenta: string
    tramite: string
    tipo: string
    fecha_envio: string
  }
  sendings: Salida[]
}
export interface GroupedMails {
  cuenta: string
  tramite: Tramite
  tipo: string
  fecha_envio: string
  sendings: Salida[]
}
export interface Salida {
  _id: string
  emisor: Emisor
  receptor: Receptor
  tramite: Tramite
  tipo: string
  motivo: string
  cantidad: string
  fecha_envio: string
  numero_interno: string
  fecha_recibido?: string
  recibido?: boolean
}

export interface Emisor {
  cuenta: string
  funcionario: string
}

export interface Receptor {
  cuenta: string
  funcionario?: Funcionario
  usuario: string,
  cargo: string
}

export interface Funcionario {
  _id: string
  nombre: string
  paterno: string
  materno: string
  cargo: string
}

export interface Tramite {
  _id: string
  estado: string
  alterno: string
  detalle: string
}



