import { Procedure } from 'src/app/procedures/models';
import { participant } from './participant.interface';
import { statusMail } from './status-mail';

export interface communication {
  _id: string;
  emitter: participant;
  receiver: participant;
  procedure: Procedure;
  reference: string;
  attachmentQuantity: string;
  internalNumber: string;
  outboundDate: string;
  inboundDate?: string;
  status: statusMail;
  rejectionReason?: string;
}
