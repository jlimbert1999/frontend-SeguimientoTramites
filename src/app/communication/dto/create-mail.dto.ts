import { receiver } from "../interfaces"

export class CreateMailDto {
    static fromFormData(form: any, participant: receiver[]) {
        return new CreateMailDto(

        )
    }
    constructor(
        public tramite: string,
        public cantidad: string,
        public motivo: string,
        public receiver: receiver[]
        public numero_interno: string
    ) {

    }
}
interface participantDTO {
    cuenta: string,
    fullname: string
    jobtitle?: string
}
