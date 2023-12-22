import { TimeControl } from 'src/app/shared/helpers';
import { Communication } from './communication.model';
import { participant, workflowResponse } from '../interfaces';

interface iteration {
  id_emitter: string;
  date: Date;
  duration?: string;
  sends: Communication[];
}
export class Workflow {
  static fromResponse(workflow: workflowResponse[], startDate: Date) {
    const model: iteration[] = workflow.map((el) => {
      return {
        id_emitter: el._id.emitterAccount,
        date: new Date(el._id.outboundDate),
        sends: el.sendings.map((el) => Communication.fromResponse(el)),
      };
    });
    return new Workflow(model, startDate);
  }
  constructor(public stages: iteration[], public startDate: Date) {}

  getWorkflowProcedure() {
    return this.stages.map((stage, index) => {
      let start: Date | undefined = index === 0 ? this.startDate : undefined;
      for (let i = this.stages.length - 1; i >= 0; i--) {
        const lastStep = this.stages[i].sends.find((send) => send.receiver.cuenta._id === stage.id_emitter);
        if (lastStep) {
          start = lastStep.inboundDate;
          break;
        }
      }
      stage.duration = start ? TimeControl.duration(start, stage.date) : 'sin tiempo';
      return stage;
    });
  }

}
