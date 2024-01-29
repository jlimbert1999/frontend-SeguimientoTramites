import { procedure } from 'src/app/procedures/interfaces';
import { participant } from '../participant.interface';
import { statusMail } from '../status-mail';

interface eventLog {
  manager: string;
  description: string;
  date: string;
}
export interface communicationResponse {
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
  eventLog?: eventLog;
}
