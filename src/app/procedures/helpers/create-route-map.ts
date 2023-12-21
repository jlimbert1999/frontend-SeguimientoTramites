import { createFormattedSheets } from './route-map';
import { Procedure } from '../models';
import { statusMail, workflowResponse } from 'src/app/communication/interfaces';

export async function createRouteMap(procedure: Procedure, workflow: workflowResponse[]) {
  workflow = workflow
    .map((communication) => {
      const { sendings, ...values } = communication;
      const filteredItems = sendings.filter(
        (send) => send.status === statusMail.Completed || send.status === statusMail.Received
      );
      return { sendings: filteredItems, ...values };
    })
    .filter((elemet) => elemet.sendings.length > 0);
  createFormattedSheets(procedure, workflow);
}
