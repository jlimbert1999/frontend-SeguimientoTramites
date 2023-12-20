import { procedure } from 'src/app/procedures/interfaces';
import { communication, participant, statusMail } from '../interfaces';

export class Communication {
  _id: string;
  emitter: participant;
  receiver: participant;
  procedure: procedure;
  reference: string;
  attachmentQuantity: string;
  internalNumber: string;
  outboundDate: string;
  inboundDate?: string;
  status: statusMail;
  rejectionReason?: string;

  static fromResponse(communication: communication) {
    return new Communication(communication);
  }
  constructor(data: communication) {
    Object.assign(this, data);
  }
}
