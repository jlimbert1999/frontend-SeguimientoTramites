import { communication } from './communication';

export interface workflow {
  _id: {
    emitterAccount: string;
    outboundDate: string;
  };
  sendings: communication[];
}
