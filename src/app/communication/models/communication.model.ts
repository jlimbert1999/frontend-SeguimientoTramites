import { groupProcedure, stateProcedure } from 'src/app/procedures/interfaces';
import { communicationResponse, participant, statusMail } from '../interfaces';

interface CommunicationProps {
  _id: string;
  emitter: participant;
  receiver: participant;
  procedure: ProcedureDetail;
  reference: string;
  attachmentQuantity: string;
  internalNumber: string;
  outboundDate: string;
  inboundDate?: string;
  rejectionReason?: string;
  status: statusMail;
}
interface ProcedureDetail {
  _id: string;
  code: string;
  reference: string;
  state: stateProcedure;
  group: groupProcedure;
}

export class Communication {
  readonly _id: string;
  readonly emitter: participant;
  readonly receiver: participant;
  readonly procedure: ProcedureDetail;
  readonly reference: string;
  readonly attachmentQuantity: string;
  readonly internalNumber: string;
  readonly outboundDate: string;
  readonly inboundDate?: string;
  readonly rejectionReason?: string;
  status: statusMail;

  static ResponseToModel(communication: communicationResponse) {
    return new Communication(communication);
  }

  constructor({
    _id,
    emitter,
    receiver,
    procedure,
    reference,
    attachmentQuantity,
    internalNumber,
    outboundDate,
    inboundDate,
    rejectionReason,
    status,
  }: CommunicationProps) {
    this._id = _id;
    this.emitter = emitter;
    this.receiver = receiver;
    this.procedure = procedure;
    this.reference = reference;
    this.attachmentQuantity = attachmentQuantity;
    this.internalNumber = internalNumber;
    this.outboundDate = outboundDate;
    this.inboundDate = inboundDate;
    this.rejectionReason = rejectionReason;
    this.status = status;
  }
}
