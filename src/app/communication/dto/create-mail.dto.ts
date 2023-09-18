import { groupProcedure } from 'src/app/procedures/interfaces/procedures-props.interface';
import { receiver, sendDetail } from '../interfaces';

export class CreateMailDto {
  static fromFormData(
    form: any,
    details: sendDetail,
    participants: receiver[]
  ) {
    const receivers = participants.map((participant) => {
      const { officer } = participant;
      const receiver = {
        cuenta: participant.id_account,
        fullname: [officer.nombre, officer.paterno, officer.materno]
          .filter(Boolean)
          .join(' '),
        ...(officer.cargo && { jobtitle: officer.cargo.nombre }),
      };
      return receiver;
    });
    return new CreateMailDto(
      details.procedure._id,
      form['cantidad'],
      form['motivo'],
      form['numero_interno'],
      receivers,
      details.id_mail
    );
  }
  id_mail: string;
  constructor(
    public id_procedure: string,
    public attachmentQuantity: string,
    public reference: string,
    public internalNumber: string,
    public receivers: {
      cuenta: string;
      fullname: string;
      jobtitle?: string;
    }[],
    currentMailId?: string
  ) {
    if (currentMailId) this.id_mail = currentMailId;
  }
}
