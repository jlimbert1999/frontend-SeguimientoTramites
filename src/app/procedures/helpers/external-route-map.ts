import { Content } from "pdfmake/interfaces"
import { ExternalDetail } from "../models/externo.model"
import { createContainers, createFirstContainerExternal, createHeader, createRouteMap, createWhiteContainers, getLastPageNumber } from "./route-map"
import { newWorkflow } from "src/app/Bandejas/interfaces/workflow.interface"

export async function createExternalRouteMap(procedure: ExternalDetail, workflow: newWorkflow[]) {
    workflow = workflow.map(element => {
        const { sendings, ...values } = element
        const filteredItems = sendings.filter(send => send.recibido === true || send.recibido === undefined)
        return { sendings: filteredItems, ...values }
    }).filter(elemet => elemet.sendings.length > 0)
    const content: Content[] = [
        await createHeader(),
        createFirstContainerExternal(procedure, workflow[0]),
    ]
    const lastNumberPage = getLastPageNumber(workflow.length)
    if (workflow.length > 0) {
        content.push(
            createContainers(workflow),
            createWhiteContainers(workflow.length, lastNumberPage))
    }
    else {
        content.push(
            createWhiteContainers(workflow.length, lastNumberPage)
        )
    }
    createRouteMap(content)
}