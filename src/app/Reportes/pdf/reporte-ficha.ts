import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, Table, TableCell, TableLayout, TDocumentDefinitions } from "pdfmake/interfaces";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import { getBase64ImageFromUrl } from "src/assets/pdf-img/image-base64";
import { Externo, WorkflowData } from "src/app/Externos/models/Externo.interface";
export async function PDF_FichaExterno(tramite: Externo, Workflow: WorkflowData[], funcionario: string) {
    let Iteraciones: any[] = []
    const logo: any = await getBase64ImageFromUrl('../../../assets/img/logo_alcaldia2.jpeg')
    const logo2: any = await getBase64ImageFromUrl('../../../assets/img/sigamos_adelante.jpg')
    let docDefinition: TDocumentDefinitions
    let dataWorkflow: any[] = [
        [{ text: 'Remitente', style: 'tableHeader' }, { text: 'Proveido', style: 'tableHeader' }, { text: 'Ingreso', style: 'tableHeader' }, { text: 'Salida', style: 'tableHeader' }, { text: 'Destinatarios', style: 'tableHeader' }]
    ]
    let sectionSolicitante: Content, sectionRepresentante: Content = []
    if (tramite.representante) {
        sectionRepresentante = [
            { text: '\nRepresentante', style: 'header' },
            { text: `Nombre: ${tramite.representante.nombre} ${tramite.representante.paterno} ${tramite.representante.materno}` },
            { text: `Documento: ${tramite.representante.documento}` },
            { text: `Dni: ${tramite.representante.dni}` },
            { text: `Telefono: ${tramite.representante.telefono}` },
        ]
    }
    if (tramite.solicitante.tipo === 'NATURAL') {
        sectionSolicitante = [
            { text: `\nSolicitante: ${tramite.solicitante.tipo}`, style: 'header' },
            { text: `Nombre: ${tramite.solicitante.nombre} ${tramite.solicitante.paterno} ${tramite.solicitante.materno}` },
            { text: `Documento: ${tramite.solicitante.documento}` },
            { text: `Dni: ${tramite.solicitante.dni}` },
            { text: `Telefono: ${tramite.solicitante.telefono}` },
        ]
    }
    else {
        sectionSolicitante = [
            { text: `\nSolicitante`, style: 'header' },
            { text: `Nombre: ${tramite.solicitante.nombre}` },
            { text: `Telefono: ${tramite.solicitante.telefono}` },
        ]
    }

    if (Workflow.length > 0) {
        Iteraciones.push({
            emisor: Workflow[0].emisor,
            motivo: Workflow[0].motivo,
            fecha_envio: Workflow[0].fecha_envio,
            fecha_recibido: Workflow[0].fecha_recibido,
            cantidad: Workflow[0].cantidad,
            receptores: []
        })
        let puntero = Workflow[0].emisor.cuenta._id
        Workflow.forEach((element) => {
            if (puntero === element.emisor.cuenta._id) {
                Iteraciones[Iteraciones.length - 1].receptores.push(element.receptor)
            }
            else {
                puntero = element.emisor.cuenta._id
                Iteraciones.push({
                    emisor: element.emisor,
                    motivo: element.motivo,
                    fecha_envio: element.fecha_envio,
                    fecha_recibido: element.fecha_recibido?element.fecha_recibido:'Sin recibir',
                    cantidad: element.cantidad,
                    receptores: [element.receptor]
                })
            }
        })
        Iteraciones.forEach(element => {
            dataWorkflow.push(
                [
                    {
                        rowSpan: element.receptores.length,
                        text: `${element.emisor.funcionario.nombre} ${element.emisor.funcionario.paterno} ${element.emisor.funcionario.materno}`
                    },
                    {
                        rowSpan: element.receptores.length,
                        text: `Referencia: ${element.motivo}\n Cantidad: ${element.cantidad}`,
                    },
                    `${moment(element.fecha_envio).format('DD-MM-YYYY HH:mm:ss')}`,
                    `${moment(element.fecha_recibido).format('DD-MM-YYYY HH:mm:ss')}`,
                    `${element.receptores[0].funcionario.nombre} ${element.receptores[0].funcionario.paterno} ${element.receptores[0].funcionario.materno}`
                ],
            )
            for (let index = 1; index < element.receptores.length; index++) {
                dataWorkflow.push(
                    ['', '', `${element.fecha_envio}`, `${element.fecha_recibido}`, `${element.receptores[index].funcionario.nombre} ${element.receptores[index].funcionario.paterno}  ${element.receptores[index].funcionario.materno} `],
                )
            }
        })
    }
    else {
        dataWorkflow.push([{ text: 'El tramite aun no ha sido enviado', colSpan: 5 }, '', '', '', ''])
    }
    docDefinition = {
        footer: [
            { text: `Generado por: ${funcionario}`, margin: [20, 0, 0, 0] },
            { text: `Fecha: ${moment(new Date()).format('DD-MM-YYYY HH:mm:ss')}`, margin: [20, 0, 0, 0] }
        ],
        content: [
            {
                columns: [
                    {
                        image: logo,
                        width: 120,
                        height: 50,
                        alignment: 'left',
                    },
                    {
                        text: `Reporte ficha de Tramite\n\n EXTERNO: ${tramite.alterno}`,
                        style: 'title',
                        alignment: 'center',
                        width: '*'
                    },
                    {
                        image: logo2,
                        width: 120,
                        height: 50,
                        alignment: 'right',
                    },
                ]
            },
            {
                text: `Referencia: ${tramite.detalle}`
            },
            {
                text: `Estado: ${tramite.estado}`
            },
            {
                columns: [
                    [
                        { text: `Cite: ${tramite.cite}` },
                        { text: `Fecha: ${moment(tramite.fecha_registro).format('DD-MM-YYYY HH:mm:ss')} ` },
                        { text: `Pin: ${tramite.pin} ` }
                    ],
                    [
                        { text: `Nº Interno: ${tramite.cite} ` },
                        { text: `Cantidad: ${tramite.cantidad} ` },
                    ]
                ]
            },
            {
                columns: [
                    sectionSolicitante,
                    sectionRepresentante
                ]
            },
            [
                {
                    text: '\n\nFlujo de trabajo\n\n', alignment: 'center', bold: true
                },
                {
                    fontSize: 9,
                    table: {
                        body: dataWorkflow
                    }
                }
            ]
        ],
        styles: {
            header: {
                fontSize: 13,
                bold: true
            },
            title: {
                fontSize: 14,
                bold: true,
                margin: [0, 0, 0, 40]
            },
            tableHeader: {
                bold: true,
                fontSize: 10,
                color: 'black',
                fillColor: '#A8DADC'
            }
        }
    }
    pdfMake.createPdf(docDefinition).print();
}
