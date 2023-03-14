import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, Table, TableCell, TableLayout, TDocumentDefinitions } from "pdfmake/interfaces";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import { getBase64ImageFromUrl } from "src/assets/pdf-img/image-base64";
import { Externo, WorkflowData } from "src/app/Externos/models/Externo.interface";

export async function PDF_FichaExterno(tramite: Externo, Workflow: WorkflowData[], funcionario: string) {
    const logo: any = await getBase64ImageFromUrl('../../../assets/img/logo_alcaldia2.jpeg')
    const logo2: any = await getBase64ImageFromUrl('../../../assets/img/sigamos_adelante.jpg')
    let docDefinition: TDocumentDefinitions
    let dataWorkflow: any[] = [
        [{ text: 'Remitente', style: 'tableHeader' }, { text: 'Proveido', style: 'tableHeader' }, { text: 'Fecha envio', style: 'tableHeader' }, { text: 'Destinatarios', style: 'tableHeader' }, { text: 'Fecha recibido', style: 'tableHeader' }]
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
        let count = 0
        let puntero = Workflow[0].emisor.cuenta._id
        let fecha_recibido = Workflow[0].fecha_recibido ? `Fecha: ${moment(Workflow[0].fecha_recibido).format('DD-MM-YYYY')}\nHora: ${moment(Workflow[0].fecha_recibido).format('HH:mm:ss')} ` : 'Sin recibir'
        for (let i = 0; i < Workflow.length; i++) {
            if (puntero === Workflow[i].emisor.cuenta._id) {
                count++
            }
            else {
                break
            }
        }
        dataWorkflow.push(
            [
                {
                    rowSpan: count,
                    text: `${Workflow[0].emisor.funcionario.nombre} ${Workflow[0].emisor.funcionario.paterno} ${Workflow[0].emisor.funcionario.materno}`
                },
                `Proveido: ${Workflow[0].motivo}\nCantidad: ${Workflow[0].cantidad}\nNº Interno: ${Workflow[0].numero_interno} `,
                `Fecha: ${moment(Workflow[0].fecha_envio).format('DD-MM-YYYY')} \nHora: ${moment(Workflow[0].fecha_envio).format('HH:mm:ss')} `,
                `${Workflow[0].receptor.funcionario.nombre} ${Workflow[0].receptor.funcionario.paterno} ${Workflow[0].receptor.funcionario.materno} `,
                fecha_recibido
            ],
        )
        for (let index = 1; index < Workflow.length; index++) {
            fecha_recibido = Workflow[index].fecha_recibido ? `Fecha: ${moment(Workflow[index].fecha_recibido).format('DD-MM-YYYY')}\nHora: ${moment(Workflow[index].fecha_recibido).format('HH:mm:ss')} ` : 'Sin recibir'
            if (puntero === Workflow[index].emisor.cuenta._id) {
                dataWorkflow.push(
                    [
                        '',
                        `Proveido: ${Workflow[index].motivo} \nCantidad: ${Workflow[index].cantidad} \nNº Interno: ${Workflow[index].numero_interno} `,
                        `Fecha: ${moment(Workflow[index].fecha_envio).format('DD-MM-YYYY')} \nHora: ${moment(Workflow[index].fecha_envio).format('HH:mm:ss')} `,
                        `${Workflow[index].receptor.funcionario.nombre} ${Workflow[index].receptor.funcionario.paterno} ${Workflow[index].receptor.funcionario.materno} `,
                        fecha_recibido
                    ],
                )
            }
            else {
                count = 0
                puntero = Workflow[index].emisor.cuenta._id
                for (let i = index; i < Workflow.length; i++) {
                    if (puntero === Workflow[i].emisor.cuenta._id) {
                        count++
                    }
                    else {
                        break
                    }
                }
                dataWorkflow.push(
                    [
                        {
                            rowSpan: count,
                            text: `${Workflow[index].emisor.funcionario.nombre} ${Workflow[index].emisor.funcionario.paterno} ${Workflow[index].emisor.funcionario.materno} `
                        },
                        `Proveido: ${Workflow[index].motivo} \nCantidad: ${Workflow[index].cantidad} \nNº Interno: ${Workflow[index].numero_interno} `,
                        `Fecha: ${moment(Workflow[index].fecha_envio).format('DD-MM-YYYY')} \nHora: ${moment(Workflow[index].fecha_envio).format('HH:mm:ss')} `,
                        `${Workflow[index].receptor.funcionario.nombre} ${Workflow[index].receptor.funcionario.paterno} ${Workflow[index].receptor.funcionario.materno} `,
                        fecha_recibido
                    ],
                )
            }
        }
    }
    else {
        dataWorkflow.push([{ text: 'El tramite aun no ha sido enviado', colSpan: 5 }, '', '', '', ''])
    }
    docDefinition = {
        footer: [
            { text: `Generado por: ${funcionario} `, margin: [20, 0, 0, 0] },
            { text: `Fecha: ${moment(new Date()).format('DD-MM-YYYY HH:mm:ss')} `, margin: [20, 0, 0, 0] }
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
                        text: `Reporte ficha de Tramite\n\n EXTERNO: ${tramite.alterno} `,
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
                text: `Referencia: ${tramite.detalle} `
            },
            {
                text: `Estado: ${tramite.estado} `
            },
            {
                columns: [
                    [
                        { text: `Cite: ${tramite.cite} ` },
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

                    fontSize: 8,

                    table: {
                        widths: [80, '*', 70, 80, 70],
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
