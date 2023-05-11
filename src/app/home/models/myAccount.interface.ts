export interface myAccount {
    _id: string,
    login: string,
    funcionario: {
        nombre: string,
        paterno: string,
        materno: string,
        cargo: string
        dni: string
        telefono: string
    }
    dependencia: {
        nombre: string,
        institucion: {
            nombre: string
        }
    }
}