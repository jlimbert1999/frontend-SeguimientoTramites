import { procedure } from 'src/app/procedures/interfaces';
import { Communication } from './communication.model';
import { groupedCommunicationResponse } from '../interfaces';

interface ID {
  account: string;
  procedure: procedure;
  outboundDate: string;
}
export class GroupedCommunication {
  static responseToModel(data: groupedCommunicationResponse) {
    return new GroupedCommunication(data._id, data.sendings);
  }
  constructor(public _id: ID, public detail: Communication[]) {}
}
