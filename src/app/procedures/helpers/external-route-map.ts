import { Content } from "pdfmake/interfaces"
import { ExternalDetail } from "../models/externo.model"
import { createFirstContainerExternal, createHeader, createRouteMap, createWhiteContainers } from "./route-map"


export async function createExternalRouteMap(procedure: ExternalDetail, workflow: any[]) {
    workflow = workflow.filter(element => element.recibido !== false)
    let content: Content[] = []
    if (workflow.length > 0) {
        // const data = createRoadMapData(workflow)
        // content = [
        //     createTitleSheet(logo1, logo2),
        //     createFirstContainerExternal(
        //         procedure,
        //         [{ nombre_completo: createFullName(workflow[0].receptor.funcionario), cargo: workflow[0].receptor.funcionario.cargo }],
        //         [
        //             moment(workflow[0].fecha_envio).format('DD-MM-YYYY'),
        //             moment(workflow[0].fecha_envio).format('HH:mm A'),
        //             workflow[0].cantidad,
        //             workflow[0].numero_interno
        //         ]
        //     ),
        //     createAprovedRouteMap(data),
        //     createWhiteContainers(data.length + 1, 8)
        // ]
    }
    else {
        content = [
            await createHeader(),
            createFirstContainerExternal(
                procedure,
                [{ nombre_completo: '', cargo: '' }],
                ['', '', '', '']
            ),
            createWhiteContainers(1, 8)
        ]
    }
    createRouteMap(content)
}