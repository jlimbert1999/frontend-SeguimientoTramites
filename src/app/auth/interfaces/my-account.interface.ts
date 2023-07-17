export interface myAccount {
    _id: string;
    login: string;
    dependencia?: {
        _id: string;
        nombre: string;
        codigo: string;
        institucion: {
            _id: string;
            nombre: string;
        };
    };
    funcionario?: {
        _id: string;
        nombre: string;
        paterno: string;
        materno: string;
        dni: number;
        telefono: number;
        direccion: string;
        expedido: string;
        cargo: {
            _id: string;
            nombre: string;
            isRoot: boolean;
            superior: null;
        };
    };
}
