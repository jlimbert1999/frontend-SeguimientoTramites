
import { groupProcedure } from "src/app/procedures/interfaces/procedures.interface"
import { receiver, sendDetail } from "../interfaces"

export class CreateMailDto {
    static fromFormData(form: any, datails: sendDetail, participants: receiver[]) {
        const receivers = participants.map(participant => {
            const { officer } = participant
            const receiver = {
                cuenta: participant.id_account,
                fullname: [officer.nombre, officer.paterno, officer.materno].filter(Boolean).join(" "),
                ...officer.cargo && { jobtitle: officer.cargo.nombre }
            }
            return receiver
        })
        return new CreateMailDto(
            datails.procedure._id,
            datails.group,
            form['cantidad'],
            form['motivo'],
            form['numero_interno'],
            receivers,
        )
    }

    constructor(
        public tramite: string,
        public tipo: groupProcedure,
        public cantidad: string,
        public motivo: string,
        public numero_interno: string,
        public receivers: {
            cuenta: string,
            fullname: string
            jobtitle?: string
        }[]
    ) {
    }
}
