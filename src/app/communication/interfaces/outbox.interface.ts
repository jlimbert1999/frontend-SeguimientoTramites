import { procedure } from 'src/app/procedures/interfaces';
import { communication } from './communication';

export interface groupedCommunication {
  _id: { account: string; procedure: procedure; outboundDate: string };
  sendings: communication[];
}
