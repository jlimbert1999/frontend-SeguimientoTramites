export interface account {
    id_cuenta: string,
    funcionario: {
        _id: string,
        nombre: string,
        paterno: string,
        materno: string,
        cargo: string
    }
    resources: string[]
    citeCode: string
    institutionCode: string
}
export interface userSocket {
    id_cuenta: string,
    funcionario: {
        _id: string,
        nombre: string,
        paterno: string,
        materno: string,
        cargo: string
    },
    socketIds: string[]
}
