export interface Archive {
    _id: string
    procedure: {
        _id: string
        estado: string
        alterno: string
        detalle: string
    }
    group: string
    account: {
        _id: string
        funcionario: {
            _id: string
            nombre: string
            paterno: string
            materno: string
            cargo: string
        }
    }
    officer: {
        _id: string
        nombre: string
        paterno: string
        materno: string
        cargo: string
    }
    description: string
    location?: string
    date: string
}