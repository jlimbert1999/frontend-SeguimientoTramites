import { TimeControl } from 'src/app/shared/helpers';
import { statusMail, workflowResponse } from '../interfaces';

export interface WorkflowProps {
  emitter: Participant;
  outboundDate: TimeDetail;
  detail: Detail[];
}

interface Detail {
  _id: string;
  receiver: Participant;
  procedure: string;
  reference: string;
  attachmentQuantity: string;
  internalNumber: string;
  inboundDate: TimeDetail;
  status: statusMail;
  rejectionReason?: string;
}
interface TimeDetail {
  date: string;
  hour: string;
  fulldate: string;
}
export interface Participant {
  cuenta: string;
  fullname: string;
  jobtitle: string;
  duration: string;
}

export class Workflow {
  static fromResponse(workflow: workflowResponse) {
    return new Workflow({
      emitter: { ...workflow.emitter, jobtitle: workflow.emitter.jobtitle ?? 'Sin cargo' },
      outboundDate: {
        fulldate: TimeControl.formatDate(new Date(workflow.outboundDate)),
        date: TimeControl.formatDate(new Date(workflow.outboundDate), 'DD/MM/YY'),
        hour: TimeControl.formatDate(new Date(workflow.outboundDate), 'HH:mm'),
      },
      detail: workflow.detail.map(({ inboundDate, receiver, ...values }) => {
        return {
          receiver: {
            ...receiver,
            jobtitle: receiver.jobtitle ?? 'Sin cargo',
          },
          ...values,
          inboundDate: inboundDate
            ? {
                fulldate: TimeControl.formatDate(new Date(inboundDate)),
                date: TimeControl.formatDate(new Date(inboundDate), 'DD/MM/YY'),
                hour: TimeControl.formatDate(new Date(inboundDate), 'HH:mm'),
              }
            : { fulldate: 'Sin recibir', date: '-', hour: '-' },
        };
      }),
    });
  }
  readonly emitter: Participant;
  readonly outboundDate: TimeDetail;
  readonly detail: Detail[];
  constructor({ emitter, outboundDate, detail }: WorkflowProps) {
    this.emitter = emitter;
    this.outboundDate = outboundDate;
    this.detail = detail;
  }
}
