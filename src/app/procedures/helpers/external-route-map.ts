import { Content } from "pdfmake/interfaces"
import { ExternalDetail } from "../models/externo.model"
import { createContainers, createFirstContainerExternal, createHeader, createRouteMap, createWhiteContainers } from "./route-map"
import { newWorkflow } from "src/app/Bandejas/interfaces/workflow.interface"

export async function createExternalRouteMap(procedure: ExternalDetail, workflow: newWorkflow[]) {
    workflow = workflow.map(element => {
        const { sendings, ...values } = element
        const filteredItems = sendings.filter(send => send.recibido === true || send.recibido === undefined)
        return { sendings: filteredItems, ...values }
    }).filter(elemet => elemet.sendings.length > 0)
    let content: Content[] = []
    if (workflow.length > 0) {
        content = [
            await createHeader(),
            createFirstContainerExternal(procedure, workflow[0]),
            createContainers(workflow),
            // createWhiteContainers(data.length + 1, 8)
        ]
    }
    else {
        content = [
            await createHeader(),
            createFirstContainerExternal(procedure),
            createWhiteContainers(1, 8)
        ]
    }
    createRouteMap(content)
}