import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, ContentOrderedList, ContentUnorderedList, Table, TableCell, TableLayout, TDocumentDefinitions } from "pdfmake/interfaces";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import { getBase64ImageFromUrl } from "src/assets/pdf-img/image-base64";
import { Externo } from "src/app/Tramites/models/Externo.interface";
import { Interno } from "src/app/Tramites/models/Interno.interface";
import { ListWorkflow, LocationProcedure } from "src/app/Bandejas/models/workflow.interface";

export async function PDF_FichaExterno(tramite: Externo, ListWorkflow: ListWorkflow[], Location: LocationProcedure[]) {
    const logo: any = await getBase64ImageFromUrl('../../../assets/img/logo_alcaldia2.jpeg')
    const logo2: any = await getBase64ImageFromUrl('../../../assets/img/sigamos_adelante.jpg')
    const tableApplicat: Table = {
        headerRows: 1,
        dontBreakRows: true,
        widths: [70, '*'],
        body: []
    }
    const tableAgent: Table = {
        headerRows: 1,
        dontBreakRows: true,
        widths: [70, '*'],
        body: []
    }
    tableApplicat.body = tramite.solicitante.tipo === 'NATURAL'
        ? [
            [{ text: `DETALLES SOLICITANTE ${tramite.solicitante.tipo}`, bold: true, colSpan: 2 }, ''],
            [{ text: 'Nombre:', bold: true, }, tramite.solicitante.nombre],
            [{ text: 'Paterno:', bold: true, }, tramite.solicitante.paterno],
            [{ text: 'Materno:', bold: true, }, tramite.solicitante.materno],
            [{ text: 'Dni:', bold: true, }, tramite.solicitante.dni],
            [{ text: 'Telefono:', bold: true, }, tramite.estado],
        ]
        : [
            [{ text: `DETALLES SOLICITANTE ${tramite.solicitante.tipo}`, bold: true, colSpan: 2 }, ''],
            [{ text: 'Nombre:', bold: true, }, tramite.solicitante.nombre],
            [{ text: 'Telefono:', bold: true, }, tramite.estado],
        ]
    tableAgent.body = tramite.representante
        ? [
            [{ text: `DETALLES REPRESENTANTE`, bold: true, colSpan: 2 }, ''],
            [{ text: 'Nombre:', bold: true, }, tramite.solicitante.nombre],
            [{ text: 'Paterno:', bold: true, }, tramite.solicitante.paterno],
            [{ text: 'Materno:', bold: true, }, tramite.solicitante.materno],
            [{ text: 'Dni:', bold: true, }, tramite.solicitante.dni],
            [{ text: 'Telefono:', bold: true, }, tramite.solicitante.telefono],
        ]
        : [
            [{ text: `DETALLES REPRESENTANTE`, bold: true, colSpan: 2 }, ''],
            [{ text: 'Sin representante legal', bold: true, colSpan: 2 }],
        ]
    const listRequirements = tramite.requerimientos.length > 0
        ? tramite.requerimientos.map(requeriment => requeriment)
        : ['Sin requerimientos']
    const tableProcedure: Table = {
        headerRows: 1,
        dontBreakRows: true,
        widths: [140, '*'],
        body: [
            [{ text: 'DETALLES TRAMITE', bold: true, colSpan: 2 }, ''],
            [{ text: 'Alterno:', bold: true, }, tramite.alterno],
            [{ text: 'Tipo:', bold: true, }, tramite.tipo_tramite.nombre],
            [{ text: 'Referencia:', bold: true, }, tramite.detalle],
            [{ text: 'Cantidad hojas:', bold: true, }, tramite.cantidad],
            [{ text: 'Fecha registro:', bold: true, }, moment(tramite.fecha_registro).format('DD-MM-YYYY  HH:mm:ss')],
            [{ text: 'Estado:', bold: true, }, tramite.estado],
            [{ text: 'Pin:', bold: true, }, tramite.pin],
            [{ text: 'Cite:', bold: true, }, tramite.cite !== '' ? tramite.cite : '------'],
            [{ text: 'Responsable registro:', bold: true }, `${tramite.cuenta.funcionario.nombre} ${tramite.cuenta.funcionario.paterno} ${tramite.cuenta.funcionario.materno} (${tramite.cuenta.funcionario.cargo})`],
        ]
    }
    let docDefinition: TDocumentDefinitions
    docDefinition = {
        footer: [
            { text: `Generado en fecha: ${moment(new Date()).format('DD-MM-YYYY HH:mm:ss')} `, margin: [20, 10, 0, 0] }
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
                        text: `Reporte ficha de tramite\n\n Externo: ${tramite.alterno} `,
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
                style: 'tableInfo',
                table: tableProcedure,
                layout: 'headerLineOnly'
            },
            {
                columns: [
                    {
                        style: 'tableInfo',
                        margin: [0, 0, 20, 0],
                        table: tableApplicat,
                        layout: 'headerLineOnly'
                    },
                    {
                        style: 'tableInfo',
                        margin: [20, 0, 0, 0],
                        table: tableAgent,
                        layout: 'headerLineOnly'
                    },
                ]
            },
            createSectionLocation(Location),
            { text: '\n\nREQUISITOS PRESENTADOS', style: 'subTitle' },
            {
                fontSize: 10,
                ul: listRequirements
            },
            {
                pageBreak: 'before',
                pageOrientation: 'landscape',
                text: '\n\nFLUJO DE TRABAJO REALIZADO\n',
                style: 'subTitle'
            },
            {

                fontSize: 8,
                table: createTableWorkflow(ListWorkflow)
            }
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
            subTitle: {
                fontSize: 12,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            tableHeader: {
                bold: true,
                fontSize: 10,
                color: 'black',
                fillColor: '#A8DADC'
            },
            tableInfo: {
                fontSize: 10,
                margin: [0, 0, 0, 20]
            }
        }
    }
    pdfMake.createPdf(docDefinition).print();
}

export async function PDF_FichaInterno(tramite: Interno, ListWorkflow: ListWorkflow[], Location: LocationProcedure[]) {
    const logo: any = await getBase64ImageFromUrl('../../../assets/img/logo_alcaldia2.jpeg')
    const logo2: any = await getBase64ImageFromUrl('../../../assets/img/sigamos_adelante.jpg')
    const tableEmitter: Table = {
        headerRows: 1,
        dontBreakRows: true,
        widths: [70, '*'],
        body: [
            [{ text: `DETALLES REMITENTE`, bold: true, colSpan: 2 }, ''],
            [{ text: 'Funcionario:', bold: true, }, tramite.remitente.nombre],
            [{ text: 'Cargo:', bold: true, }, tramite.remitente.cargo]
        ]
    }
    const tableReceiver: Table = {
        headerRows: 1,
        dontBreakRows: true,
        widths: [70, '*'],
        body: [
            [{ text: `DETALLES DESTINATARIO`, bold: true, colSpan: 2 }, ''],
            [{ text: 'Funcionario:', bold: true, }, tramite.destinatario.nombre],
            [{ text: 'Cargo:', bold: true, }, tramite.destinatario.cargo],
        ]
    }
    const tableProcedure: Table = {
        headerRows: 1,
        dontBreakRows: true,
        widths: [140, '*'],
        body: [
            [{ text: 'DETALLES TRAMITE', bold: true, colSpan: 2 }, ''],
            [{ text: 'Alterno:', bold: true, }, tramite.alterno],
            [{ text: 'Tipo:', bold: true, }, tramite.tipo_tramite.nombre],
            [{ text: 'Referencia:', bold: true, }, tramite.detalle],
            [{ text: 'Cantidad hojas:', bold: true, }, tramite.cantidad],
            [{ text: 'Fecha registro:', bold: true, }, moment(tramite.fecha_registro).format('DD-MM-YYYY  HH:mm:ss')],
            [{ text: 'Estado:', bold: true, }, tramite.estado],
            [{ text: 'Cite:', bold: true, }, tramite.cite !== '' ? tramite.cite : '------'],
            [{ text: 'Responsable registro:', bold: true }, `${tramite.cuenta.funcionario.nombre} ${tramite.cuenta.funcionario.paterno} ${tramite.cuenta.funcionario.materno} (${tramite.cuenta.funcionario.cargo})`],
        ]
    }
    let docDefinition: TDocumentDefinitions
    docDefinition = {
        footer: [
            { text: `Generado en fecha: ${moment(new Date()).format('DD-MM-YYYY HH:mm:ss')} `, margin: [20, 10, 0, 0] }
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
                        text: `Reporte ficha de tramite\n\n Interno: ${tramite.alterno} `,
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
                style: 'tableInfo',
                table: tableProcedure,
                layout: 'headerLineOnly'
            },
            {
                style: 'tableInfo',
                table: tableEmitter,
                layout: 'headerLineOnly'
            },
            {
                style: 'tableInfo',
                table: tableReceiver,
                layout: 'headerLineOnly'
            },
            createSectionLocation(Location),
            {
                pageBreak: 'before',
                pageOrientation: 'landscape',
                text: '\n\nFLUJO DE TRABAJO REALIZADO\n',
                style: 'subTitle'
            },
            {

                fontSize: 8,
                table: createTableWorkflow(ListWorkflow)
            }
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
            subTitle: {
                fontSize: 12,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            tableHeader: {
                bold: true,
                fontSize: 10,
                color: 'black',
                fillColor: '#A8DADC'
            },
            tableInfo: {
                fontSize: 10,
                margin: [0, 0, 0, 20]
            }
        }
    }
    pdfMake.createPdf(docDefinition).print();
}

function createTableWorkflow(List: ListWorkflow[]): Table {
    const tableWorkflow: Table = {
        dontBreakRows: true,
        widths: ['*', '*', '*', '*'],
        headerRows: 1,
        body: [
            [{ text: 'EMISOR', style: 'tableHeader' },
            { text: 'DETALLES ENVIO', style: 'tableHeader' },
            { text: 'RECEPTOR', style: 'tableHeader' },
            { text: 'DETALLES RECIBIDO', style: 'tableHeader' }],
        ]
    }
    if (List.length === 0) {
        tableWorkflow.body.push([{ text: 'El tramite no ha sido remitido', colSpan: 4 }, '', '', ''])
        return tableWorkflow
    }
    List.forEach(item => {
        tableWorkflow.body.push(
            [
                {
                    text: `${item.officer.fullname} (${item.officer.jobtitle})\nUNIDAD: ${item.workUnit} - ${item.workInstitution}`,
                    rowSpan: item.sends.length
                },
                {
                    text: `DURACION:  ${item.duration}\nFECHA:  ${moment(item.shippigDate).format('DD-MM-YYYY HH:mm:ss')}\nCANTIDAD: ${item.adjunt}\nREFERENCIA: ${item.reference}`,
                    rowSpan: item.sends.length
                },
                {
                    text: `${item.sends[0].officer.fullname} (${item.sends[0].officer.jobtitle})\nUNIDAD: ${item.sends[0].workUnit} - ${item.sends[0].workInstitution}`
                },
                {
                    text: `FECHA: ${item.sends[0].receivedDate ? moment(item.sends[0].receivedDate).format('DD-MM-YYYY HH:mm:ss') : 'Sin recibir'}`,
                    rowSpan: item.sends.length
                },
            ]
        )
        if (item.sends.length - 1 > 0) {
            for (let j = 1; j < item.sends.length; j++) {
                tableWorkflow.body.push(
                    [
                        '', '',
                        {
                            text: `${item.sends[j].officer.fullname} (${item.sends[j].officer.jobtitle})\nUNIDAD: ${item.workUnit} - ${item.workInstitution}`
                        },
                        {
                            text: `FECHA: ${item.sends[j].receivedDate ? moment(item.sends[j].receivedDate).format('DD-MM-YYYY HH:mm:ss') : 'Sin recibir'}`
                        }
                    ]
                )
            }
        }
    })
    return tableWorkflow
}
function createSectionLocation(location: LocationProcedure[]): Content {
    if (location.length === 0) {
        return ''
    }
    const tableLocation: Table = {
        headerRows: 1,
        dontBreakRows: true,
        widths: ['*', '*'],
        body: [
            [{ text: 'DEPENDENCIA', bold: true, alignment: 'center' }, { text: 'FUNCIONARIO', bold: true, alignment: 'center' }]]
    }
    location.forEach(item => {
        tableLocation.body.push(
            [item.cuenta.dependencia.nombre,
            `${item.cuenta.funcionario.nombre} ${item.cuenta.funcionario.paterno} ${item.cuenta.funcionario.materno}\n ${item.cuenta.funcionario.cargo}`]
        )
    })
    return ([
        { text: '\n\nUBICACION DEL TRAMITE\n', style: 'subTitle' },
        {
            style: 'tableInfo',
            table: tableLocation
        },
    ])
}