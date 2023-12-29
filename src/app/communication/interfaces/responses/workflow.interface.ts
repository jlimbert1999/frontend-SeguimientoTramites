import { statusMail } from '../status-mail';

export interface workflowResponse {
  emitter: Participant;
  outboundDate: string;
  detail: Detail[];
}

interface Detail {
  _id: string;
  receiver: Participant;
  procedure: string;
  reference: string;
  attachmentQuantity: string;
  internalNumber: string;
  inboundDate?: string;
  status: statusMail;
  rejectionReason?: string;
}

interface Participant {
  cuenta: string;
  fullname: string;
  jobtitle: string;
  duration: string;
}
