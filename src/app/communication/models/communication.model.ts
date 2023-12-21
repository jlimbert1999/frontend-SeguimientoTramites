import { procedure } from 'src/app/procedures/interfaces';
import { communicationResponse, participant, statusMail } from '../interfaces';
import { TimeControl } from 'src/app/shared/helpers';

interface iteration {
  _id: string;
  emitter: participant;
  receiver: participant;
  procedure: procedure;
  reference: string;
  attachmentQuantity: string;
  internalNumber: string;
  outboundDate: Date;
  inboundDate?: Date;
  status: statusMail;
  rejectionReason?: string;
}
export class Communication {
  // static fromResponse(communication: communicationResponse) {
  //   return new Communication(communication);
  // }
  constructor({
    emitter,
    receiver,
    procedure,
    reference,
    attachmentQuantity,
    internalNumber,
    status,
    outboundDate,
    inboundDate,
    rejectionReason,
  }: iteration) {
    this.emitter = emitter;
    this.receiver = receiver;
    this.procedure = procedure;
    this.reference = reference;
    this.attachmentQuantity = attachmentQuantity;
    this.internalNumber = internalNumber;
    this.outboundDate = outboundDate;
    this.status = status;
    this.rejectionReason = rejectionReason;
    this.inboundDate = inboundDate;
  }

  get receptionTime(): string {
    if (!this.inboundDate) return 'Pendiente de aceptacion';
    return TimeControl.duration(this.outboundDate, this.inboundDate);
  }
}
