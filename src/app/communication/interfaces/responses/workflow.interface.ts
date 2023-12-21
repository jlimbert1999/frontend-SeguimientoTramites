import { communicationResponse } from './communication.interface';

export interface workflowResponse {
  _id: {
    emitterAccount: string;
    outboundDate: string;
  };
  sendings: communicationResponse[];
}
