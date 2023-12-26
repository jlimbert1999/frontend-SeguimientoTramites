import { statusMail } from '../status-mail';

export interface workflowResponse {
  emitter: Partipant;
  outboundDate: string;
  detail: Detail[];
}

export interface Detail {
  _id: string;
  receiver: Partipant;
  procedure: string;
  reference: string;
  attachmentQuantity: string;
  internalNumber: string;
  inboundDate?: string;
  status: statusMail;
  rejectionReason?: string;
}

interface Partipant {
  cuenta: string;
  fullname: string;
  jobtitle: string;
  duration: string;
}
