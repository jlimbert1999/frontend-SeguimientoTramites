import { procedure } from 'src/app/procedures/interfaces';
import { Communication } from './communication.model';
import { groupedCommunicationResponse, statusMail } from '../interfaces';

interface ID {
  account: string;
  procedure: procedure;
  outboundDate: string;
}
export class GroupedCommunication {
  static responseToModel({ _id, sendings }: groupedCommunicationResponse) {
    return new GroupedCommunication(
      _id,
      sendings.map((send) => Communication.ResponseToModel(send))
    );
  }
  constructor(public _id: ID, public detail: Communication[]) {}

  canBeManaged(): boolean {
    return this.detail.some((mail) => mail.status !== statusMail.Pending);
  }
}
