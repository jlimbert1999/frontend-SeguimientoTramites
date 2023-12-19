import { TransferDetails, receiver } from '../interfaces';
interface Mail {
  id_mail?: string;
  id_procedure: string;
  attachmentQuantity: string;
  reference: string;
  internalNumber: string;
  receivers: participant[];
}
interface participant {
  cuenta: string;
  fullname: string;
  jobtitle?: string;
}

export class CreateMailDto {
  id_mail?: string;
  id_procedure: string;
  attachmentQuantity: string;
  reference: string;
  internalNumber: string;
  receivers: participant[];
  static fromFormData(FormSend: any, receivers: receiver[], details: TransferDetails) {
    const participants: participant[] = receivers.map((receiver) => {
      const { officer } = receiver;
      return {
        cuenta: receiver.id_account,
        fullname: receiver.officer.fullname,
        ...(officer.cargo && { jobtitle: officer.cargo.nombre }),
      };
    });
    return new CreateMailDto({
      id_mail: details.id_mail,
      id_procedure: details.id_procedure,
      attachmentQuantity: details.attachmentQuantity,
      reference: FormSend['motivo'],
      internalNumber: FormSend['numero_interno'],
      receivers: participants,
    });
  }

  constructor({ id_procedure, id_mail, receivers, attachmentQuantity, internalNumber, reference }: Mail) {
    if (id_mail) this.id_mail = id_mail;
    this.id_procedure = id_procedure;
    this.attachmentQuantity = attachmentQuantity;
    this.reference = reference;
    this.internalNumber = internalNumber;
    this.receivers = receivers;
  }
}
