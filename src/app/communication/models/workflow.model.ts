import { TimeControl } from 'src/app/shared/helpers';
import { workflowResponse } from '../interfaces';

interface actor {
  cuenta: string;
  fullname: string;
  jobtitle?: string;
  duration: string;
}
interface stage {
  _id: string;
  receiver: actor;
  procedure: string;
  reference: string;
  attachmentQuantity: string;
  internalNumber: string;
  inboundDate?: string;
  status: string;
  rejectionReason?: string;
}
export class Workflow {
  static fromResponse(workflow: workflowResponse) {
    // workflow.outboundDate = TimeControl.format(new Date(workflow.outboundDate));
    // workflow.detail.map((send) => {
    //   send.inboundDate = send.inboundDate ? TimeControl.format(new Date(send.inboundDate)) : 'Sin recibir';
    //   switch (send.status) {
    //     case 'rejected':
    //       send.status = 'Rechazado';
    //       break;

    //     default:
    //       break;
    //   }
    //   return send;
    // });
    // return new Workflow(
    //   workflow.emitter,
    //   { fulldate: workflow.outboundDate, date: TimeControl.format(new Date(wo)), hour: '' },
    //   []
    // );
  }
  constructor(
    public emitter: actor,
    public time: {
      fulldate: string;
      date: string;
      hour: string;
    },
    public detail: stage[]
  ) {}
}
