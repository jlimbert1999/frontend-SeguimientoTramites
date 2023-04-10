export interface RolDto {
    role: string
    privileges: {
        resource: string,
        create: boolean,
        update: boolean,
        read: boolean,
        delete: boolean
    }[]
}

export interface Rol {
    _id: string
    role: string
    privileges: {
        resource: string,
        create: boolean,
        update: boolean,
        read: boolean,
        delete: boolean
    }[]
}