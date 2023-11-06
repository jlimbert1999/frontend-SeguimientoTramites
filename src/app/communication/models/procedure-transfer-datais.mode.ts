import { Procedure } from 'src/app/procedures/models';
import { communication } from '../interfaces';

export class ProcedureTransferDetails {
  id_mail?: string;
  attachmentQuantity: string;
  procedure: procedure;

  static fromfirstSend(procedure: Procedure) {
    return new ProcedureTransferDetails({
      procedure: { _id: procedure._id, code: procedure.code },
      attachmentQuantity: procedure.amount,
    });
  }
  static fromSend(mail: communication) {
    return new ProcedureTransferDetails({
      procedure: { _id: mail.procedure._id, code: mail.procedure.code },
      attachmentQuantity: mail.attachmentQuantity,
      id_mail: mail._id,
    });
  }

  constructor({ attachmentQuantity, procedure, id_mail }: TransferDetails) {
    if (id_mail) this.id_mail = id_mail;
    this.attachmentQuantity = attachmentQuantity;
    this.procedure = procedure;
  }
}

interface TransferDetails {
  id_mail?: string;
  attachmentQuantity: string;
  procedure: procedure;
}
interface procedure {
  _id: string;
  code: string;
}
