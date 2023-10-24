import { Content } from 'pdfmake/interfaces';
import {
  createContainers,
  createFirstContainerInternal,
  createHeader,
  createRouteMap,
  createWhiteContainers,
  getLastPageNumber,
} from './route-map';
import { statusMail, workflow } from 'src/app/communication/interfaces';
import { InternalProcedure } from '../models';

export async function createInternalRouteMap(
  procedure: InternalProcedure,
  workflow: workflow[]
) {
  workflow = workflow
    .map((element) => {
      const { sendings, ...values } = element;
      const filteredItems = sendings.filter(
        (send) =>
          send.status === statusMail.Completed ||
          send.status === statusMail.Received
      );
      return { sendings: filteredItems, ...values };
    })
    .filter((elemet) => elemet.sendings.length > 0);
  const content: Content[] = [
    await createHeader(),
    createFirstContainerInternal(procedure, workflow[0]),
  ];
  const lastNumberPage = getLastPageNumber(workflow.length);
  if (workflow.length > 0) {
    content.push(
      createContainers(workflow),
      createWhiteContainers(workflow.length, lastNumberPage)
    );
  } else {
    content.push(createWhiteContainers(workflow.length, lastNumberPage));
  }
  createRouteMap(content);
}
