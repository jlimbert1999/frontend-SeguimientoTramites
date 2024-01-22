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

  static ResponseToModel({ emitter, receiver, ...props }: communicationResponse) {
    emitter.jobtitle = emitter.jobtitle ?? 'SIN CARGO';
    receiver.jobtitle = receiver.jobtitle ?? 'SIN CARGO';
    return new Communication({
      ...props,
      emitter,
      receiver,
    });
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
  
  statusLabel(): { label: string; color: string } {
    const states = {
      [statusMail.Received]: { label: 'RECIBIDO', color: '#55A630' },
      [statusMail.Rejected]: { label: 'RECHAZADO', color: '#D90429' },
      [statusMail.Completed]: { label: 'COMPLETADO', color: '#415A77' },
      [statusMail.Archived]: { label: 'ARCHIVADO', color: '#0077B6' },
      [statusMail.Pending]: { label: 'PENDIENTE', color: '#F48C06' },
    };
    return states[this.status];
  }

}
