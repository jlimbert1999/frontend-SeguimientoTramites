import { job } from "../interfaces/job.interface"

export class Officer {
    static officerFromJson(obj: any) {
        if (typeof obj['cargo'] === 'string') delete obj['cargo']
        return new Officer(
            obj['_id'],
            obj['nombre'],
            obj['paterno'],
            obj['materno'],
            obj['dni'],
            obj['telefono'],
            obj['direccion'],
            obj['activo'],
            obj['cuenta'],
            obj['cargo'],
        )
    }
    constructor(
        public _id: string,
        public nombre: string,
        public paterno: string,
        public materno: string,
        public dni: number,
        public telefono: number,
        public direccion: string,
        public activo: boolean,
        public cuenta: boolean,
        public cargo?: job
    ) {
    }
    get fullname() {
        return `${this.nombre.trim()} ${this.paterno.trim()} ${this.materno.trim()}`
    }

    get fullWorkTitle() {
        return `${this.fullname} (${this.cargo ? this.cargo.nombre : 'SIN CARGO'})`
    }

}