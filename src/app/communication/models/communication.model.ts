import { procedure } from 'src/app/procedures/interfaces';
import { communicationResponse, participant, statusMail } from '../interfaces';
import { TimeControl } from 'src/app/shared/helpers';

export class Communication {
  inboundDate?: Date;
  static fromResponse({
    _id,
    emitter,
    receiver,
    procedure,
    reference,
    attachmentQuantity,
    internalNumber,
    outboundDate,
    status,
    rejectionReason,
    inboundDate,
  }: communicationResponse) {
    return new Communication(
      _id,
      emitter,
      receiver,
      procedure,
      reference,
      attachmentQuantity,
      internalNumber,
      outboundDate,
      status,
      rejectionReason,
      inboundDate
    );
  }
  constructor(
    public _id: string,
    public emitter: participant,
    public receiver: participant,
    public procedure: procedure,
    public reference: string,
    public attachmentQuantity: string,
    public internalNumber: string,
    public outboundDate: string,
    public status: statusMail,
    public rejectionReason?: string,
    inboundDate?: string
  ) {
    if (inboundDate) this.inboundDate = new Date(inboundDate);
  }

  get receptionTime(): string {
    if (!this.inboundDate) return 'Pendiente de aceptacion';
    return TimeControl.duration(this.outboundDate, this.inboundDate);
  }
}
