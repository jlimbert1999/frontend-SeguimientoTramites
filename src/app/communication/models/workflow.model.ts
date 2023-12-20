import { workflow } from '../interfaces';
import { Communication } from './communication.model';

interface data {
  _id: string;
  date: string;
  duration: string;
  sends: Communication[];
}
export class Workflow {
  constructor(public data: data[]) {}
  getWorkflowProcedure() {
    return this.data.map((el) => {
      el.sends.forEach(item=>{
        // this.data.
      })
      return el;
    });
  }
}
