import { procedure } from 'src/app/procedures/interfaces';
import { communicationResponse } from './communication.interface';

export interface groupedCommunicationResponse {
  _id: { account: string; procedure: procedure; outboundDate: string };
  sendings: communicationResponse[];
}
