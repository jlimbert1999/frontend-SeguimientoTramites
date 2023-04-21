import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, ContentOrderedList, ContentUnorderedList, Table, TableCell, TableLayout, TDocumentDefinitions } from "pdfmake/interfaces";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import { getBase64ImageFromUrl } from "src/assets/pdf-img/image-base64";
import { Externo } from "src/app/Tramites/models/Externo.interface";
import { LocationProcedure, WorkflowData } from "src/app/Bandejas/models/workflow.interface";

export async function PDF_FichaExterno(tramite: Externo, Workflow: WorkflowData[], Location: LocationProcedure[]) {
    const logo: any = await getBase64ImageFromUrl('../../../assets/img/logo_alcaldia2.jpeg')
    const logo2: any = await getBase64ImageFromUrl('../../../assets/img/sigamos_adelante.jpg')
    let docDefinition: TDocumentDefinitions
    let tableApplicat: Table = {
        headerRows: 1,
        dontBreakRows: true,
        widths: [70, '*'],
        body: []
    }
    let tableAgent: Table = {
        headerRows: 1,
        dontBreakRows: true,
        widths: [70, '*'],
        body: []
    }
    let listRequirements = tramite.requerimientos.map(requeriment => requeriment)
    let tableLocation: Table = {
        headerRows: 1,
        dontBreakRows: true,
        widths: ['*', '*'],
        body: [
            [{ text: 'DEPENDENCIA', bold: true, alignment: 'center' }, { text: 'FUNCIONARIO', bold: true, alignment: 'center' }]]
    }
    const tableProcedure: Table = {
        headerRows: 1,
        dontBreakRows: true,
        widths: [140, '*'],
        body: [
            [{ text: 'DETALLES TRAMITE', bold: true, colSpan: 2 }, ''],
            [{ text: 'Alterno:', bold: true, }, tramite.alterno],
            [{ text: 'Referencia:', bold: true, }, tramite.detalle],
            [{ text: 'Cantidad hojas:', bold: true, }, tramite.cantidad],
            [{ text: 'Fecha registro:', bold: true, }, moment(tramite.fecha_registro).format('DD-MM-YYYY  HH:mm:ss')],
            [{ text: 'Estado:', bold: true, }, tramite.estado],
            [{ text: 'Pin:', bold: true, }, tramite.pin],
            [{ text: 'Cite:', bold: true, }, tramite.cite !== '' ? tramite.cite : '------'],
            [{ text: 'Responsable registro:', bold: true }, `${tramite.cuenta.funcionario.nombre} ${tramite.cuenta.funcionario.paterno} ${tramite.cuenta.funcionario.materno} (${tramite.cuenta.funcionario.cargo})`],
        ]
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

    let tableWorkflow: Table = {
        dontBreakRows: true,
        body: [
            [{ text: 'Detalles tramite', style: 'tableHeader', colSpan: 2 }, ''],
            [{ text: 'Alterno', style: 'tableHeader' }, 'siii'],
        ]
    }
    Location.forEach(item => {
        tableLocation.body.push(
            [item.cuenta.dependencia.nombre,
            `${item.cuenta.funcionario.nombre} ${item.cuenta.funcionario.paterno} ${item.cuenta.funcionario.materno}\n ${item.cuenta.funcionario.cargo}`]
        )
    })



    // if (Workflow.length > 0) {
    //     let count = 0
    //     let puntero = Workflow[0].emisor.cuenta._id
    //     let fecha_recibido = Workflow[0].fecha_recibido ? `Fecha: ${moment(Workflow[0].fecha_recibido).format('DD-MM-YYYY')}\nHora: ${moment(Workflow[0].fecha_recibido).format('HH:mm:ss')} ` : 'Sin recibir'
    //     for (let i = 0; i < Workflow.length; i++) {
    //         if (puntero === Workflow[i].emisor.cuenta._id) {
    //             count++
    //         }
    //         else {
    //             break
    //         }
    //     }
    //     dataWorkflow.push(
    //         [
    //             {
    //                 rowSpan: count,
    //                 text: `${Workflow[0].emisor.funcionario.nombre} ${Workflow[0].emisor.funcionario.paterno} ${Workflow[0].emisor.funcionario.materno}`
    //             },
    //             `Proveido: ${Workflow[0].motivo}\nCantidad: ${Workflow[0].cantidad}\nNº Interno: ${Workflow[0].numero_interno} `,
    //             `Fecha: ${moment(Workflow[0].fecha_envio).format('DD-MM-YYYY')} \nHora: ${moment(Workflow[0].fecha_envio).format('HH:mm:ss')} `,
    //             `${Workflow[0].receptor.funcionario.nombre} ${Workflow[0].receptor.funcionario.paterno} ${Workflow[0].receptor.funcionario.materno} `,
    //             fecha_recibido
    //         ],
    //     )
    //     for (let index = 1; index < Workflow.length; index++) {
    //         fecha_recibido = Workflow[index].fecha_recibido ? `Fecha: ${moment(Workflow[index].fecha_recibido).format('DD-MM-YYYY')}\nHora: ${moment(Workflow[index].fecha_recibido).format('HH:mm:ss')} ` : 'Sin recibir'
    //         if (puntero === Workflow[index].emisor.cuenta._id) {
    //             dataWorkflow.push(
    //                 [
    //                     '',
    //                     `Proveido: ${Workflow[index].motivo} \nCantidad: ${Workflow[index].cantidad} \nNº Interno: ${Workflow[index].numero_interno} `,
    //                     `Fecha: ${moment(Workflow[index].fecha_envio).format('DD-MM-YYYY')} \nHora: ${moment(Workflow[index].fecha_envio).format('HH:mm:ss')} `,
    //                     `${Workflow[index].receptor.funcionario.nombre} ${Workflow[index].receptor.funcionario.paterno} ${Workflow[index].receptor.funcionario.materno} `,
    //                     fecha_recibido
    //                 ],
    //             )
    //         }
    //         else {
    //             count = 0
    //             puntero = Workflow[index].emisor.cuenta._id
    //             for (let i = index; i < Workflow.length; i++) {
    //                 if (puntero === Workflow[i].emisor.cuenta._id) {
    //                     count++
    //                 }
    //                 else {
    //                     break
    //                 }
    //             }
    //             dataWorkflow.push(
    //                 [
    //                     {
    //                         rowSpan: count,
    //                         text: `${Workflow[index].emisor.funcionario.nombre} ${Workflow[index].emisor.funcionario.paterno} ${Workflow[index].emisor.funcionario.materno} `
    //                     },
    //                     `Proveido: ${Workflow[index].motivo} \nCantidad: ${Workflow[index].cantidad} \nNº Interno: ${Workflow[index].numero_interno} `,
    //                     `Fecha: ${moment(Workflow[index].fecha_envio).format('DD-MM-YYYY')} \nHora: ${moment(Workflow[index].fecha_envio).format('HH:mm:ss')} `,
    //                     `${Workflow[index].receptor.funcionario.nombre} ${Workflow[index].receptor.funcionario.paterno} ${Workflow[index].receptor.funcionario.materno} `,
    //                     fecha_recibido
    //                 ],
    //             )
    //         }
    //     }
    // }
    // else {
    //     dataWorkflow.push([{ text: 'El tramite aun no ha sido enviado', colSpan: 5 }, '', '', '', ''])
    // }
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
                        text: `Reporte ficha de tramite\n\n EXTERNO: ${tramite.alterno} `,
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
            // {
            //     text: `Referencia: ${tramite.detalle} `
            // },
            // {
            //     text: `Estado: ${tramite.estado} `
            // },
            // {
            //     columns: [
            //         [
            //             { text: `Cite: ${tramite.cite} ` },
            //             { text: `Fecha: ${moment(tramite.fecha_registro).format('DD-MM-YYYY HH:mm:ss')} ` },
            //             { text: `Pin: ${tramite.pin} ` }
            //         ],
            //         [
            //             { text: `Nº Interno: ${tramite.cite} ` },
            //             { text: `Cantidad: ${tramite.cantidad} ` },
            //         ]
            //     ]
            // },
            // {
            //     columns: [
            //         sectionSolicitante,
            //         sectionRepresentante
            //     ]
            // },
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
            { text: '\n\nREQUISITOS PRESENTADOS', style: 'subTitle' },
            {
                fontSize: 10,
                ul: listRequirements
            },
            { text: '\n\nUBICACION DEL TRAMITE\n', style: 'subTitle' },
            {
                style: 'tableInfo',
                table: tableLocation
            }


            // [
            //     {
            //         text: '\n\nFlujo de trabajo\n\n', alignment: 'center', bold: true
            //     },
            //     {

            //         fontSize: 8,

            //         table: {
            //             widths: [80, '*', 70, 80, 70],
            //             body: dataWorkflow
            //         }
            //     }
            // ]
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
