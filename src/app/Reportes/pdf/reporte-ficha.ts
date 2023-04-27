import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, ContentOrderedList, ContentUnorderedList, Table, TableCell, TableLayout, TDocumentDefinitions } from "pdfmake/interfaces";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import { getBase64ImageFromUrl } from "src/assets/pdf-img/image-base64";
import { Externo } from "src/app/Tramites/models/Externo.interface";
import { ListWorkflow, LocationProcedure } from "src/app/Bandejas/models/workflow.interface";

export async function PDF_FichaExterno(tramite: Externo, ListWorkflow: ListWorkflow[], Location: LocationProcedure[]) {
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
        widths: ['*', '*', '*', '*'],
        headerRows: 1,
        body: [
            [{ text: 'EMISOR', style: 'tableHeader' }, { text: 'DETALLES', style: 'tableHeader' }, { text: 'PROVEIDO', style: 'tableHeader' }, { text: 'RECEPTOR', style: 'tableHeader' }],
        ]
    }
    ListWorkflow.forEach(item => {
        tableWorkflow.body.push(
            [
                {
                    text: `${item.officer.fullname} (${item.officer.jobtitle})\nUNIDAD: ${item.workUnit} - ${item.workInstitution}`,
                    rowSpan: item.sends.length
                },
                {
                    text: `FECHA ENVIO:  ${moment(item.shippigDate).format('DD-MM-YYYY HH:mm:ss')}\nCANTIDAD:  ${item.adjunt}\nDURACION:  ${item.duration}`,
                    rowSpan: item.sends.length
                },
                {
                    text: `${item.reference}`,
                    rowSpan: item.sends.length
                },
                {
                    text: item.sends[0].officer.fullname
                }
            ]
        )
        if (item.sends.length - 1 > 0) {
            for (let j = 1; j < item.sends.length; j++) {
                tableWorkflow.body.push(
                    [
                        '', '', '',
                        {
                            text: `${item.sends[j].officer.fullname} (${item.sends[j].officer.jobtitle})\n`
                        }
                    ]

                )

            }
        }


        // item.sends.forEach(subitem => {
        //     tableWorkflow.body.push(['', '', '',
        //         {
        //             text: subitem.officer.fullname
        //         }]

        //     )
        // })
    })
    Location.forEach(item => {
        tableLocation.body.push(
            [item.cuenta.dependencia.nombre,
            `${item.cuenta.funcionario.nombre} ${item.cuenta.funcionario.paterno} ${item.cuenta.funcionario.materno}\n ${item.cuenta.funcionario.cargo}`]
        )
    })

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
            },
            {
                pageBreak: 'before',
                pageOrientation: 'landscape',
                text: '\n\nFLUJO DE TRABAJO REALIZADO\n',
                style: 'subTitle'
            },
            {

                fontSize: 8,
                table: tableWorkflow
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
