import { Content, ContentTable, TDocumentDefinitions, TableCell } from "pdfmake/interfaces"
import { convertirImagenABase64 } from "src/app/helpers/pdf/imageBase64"
import { external } from "../interfaces/external.interface"
import * as moment from "moment"
import { ExternalDetail } from "../models/externo.model"
import * as pdfMake from "pdfmake/build/pdfmake"
import { newWorkflow, sending } from "src/app/Bandejas/interfaces/workflow.interface"
const ordinales = require("ordinales-js");

export async function createHeader(): Promise<Content> {
    return [
        {
            style: 'cabecera',
            columns: [
                {
                    image: await convertirImagenABase64('../../../assets/img/logo_alcaldia2.jpeg'),
                    width: 150,
                    height: 60,
                },
                {
                    text: '\nHOJA DE RUTA DE CORRESPONDENCIA',
                    bold: true,
                    alignment: 'center',
                    // width: 300,

                },
                {
                    image: await convertirImagenABase64('../../../assets/img/logo_sacaba.jpeg'),
                    width: 70,
                    height: 70,
                },
            ]
        }
    ]
}


export function createFirstContainerExternal(procedure: ExternalDetail, firstSend: newWorkflow): ContentTable {
    let sectionReceiver: TableCell[] = []
    firstSend.sendings.forEach(dest => {
        sectionReceiver.push([`DESTINATARIO: ${dest.receptor.fullname}`, `CARGO: ${dest.receptor.jobtitle}`])
    })
    return {
        fontSize: 7,
        table: {
            widths: ['*'],
            body: [
                [{ text: 'PRIMERA PARTE', bold: true }],
                [
                    {
                        border: [true, false, true, false],
                        style: 'selection_container',
                        fontSize: 6,
                        columns: [
                            {
                                width: 100,
                                table: {
                                    widths: [75, 5],
                                    body: [
                                        [
                                            { text: 'CORRESPONDENCIA INTERNA', border: [false, false, false, false] },
                                            { text: '', style: 'header' }
                                        ]
                                    ]
                                }
                            },
                            {
                                width: 100,
                                table: {
                                    widths: [75, 5],
                                    body: [
                                        [
                                            { text: 'CORRESPONDENCIA EXTERNA', border: [false, false, false, false] },
                                            { text: 'X', style: 'header' }
                                        ]
                                    ]
                                }
                            },
                            {
                                width: 50,
                                table: {
                                    widths: [30, 5],
                                    body: [
                                        [
                                            { text: 'COPIA\n\n', border: [false, false, false, false] },
                                            { text: '', style: 'header' }
                                        ]
                                    ]
                                }
                            },
                            {
                                width: '*',
                                table: {
                                    widths: [90, '*'],
                                    body: [
                                        [
                                            { text: 'NRO. UNICO DE CORRESPONDENCIA', border: [false, false, false, false] },
                                            { text: `${procedure.alterno}`, bold: true, fontSize: 11 }
                                        ]
                                    ]
                                }
                            },
                        ]
                    },
                ],
                [
                    {
                        border: [true, false, true, false],
                        columns: [
                            {
                                width: 60,
                                text: ''
                            },
                            {
                                fontSize: 5,
                                alignment: 'center',
                                table: {
                                    widths: [100, 70, 60, 80],
                                    body: [
                                        [
                                            '',
                                            'FECHA',
                                            'HORA',
                                            'CANTIDAD DE HOJAS / ANEXOS'
                                        ],
                                        [
                                            { text: 'EMISION / RECEPCION', border: [false, false, false, false], fontSize: 7 },
                                            { text: `${moment(procedure.fecha_registro).format('DD-MM-YYYY')}`, fontSize: 8, border: [true, true, true, true] },
                                            { text: `${moment(procedure.fecha_registro).format('HH:mm A')}`, fontSize: 8, border: [true, true, true, true] },
                                            { text: `${procedure.cantidad}`, fontSize: 6, border: [true, true, true, true] },
                                        ]
                                    ]
                                },
                                layout: {
                                    defaultBorder: false,
                                }
                            },
                            {
                                width: 120,
                                text: ''
                            },
                        ]
                    },
                ],
                [
                    {
                        border: [true, false, true, false],
                        table: {
                            widths: ['*', '*'],
                            body: [
                                [{ text: 'DATOS DE ORIGEN', bold: true }, ''],
                                [`${procedure.cite} / TEL.: ${procedure.solicitante.telefono}`,
                                {
                                    table: {
                                        widths: [85, 100, 40],
                                        body: [
                                            [
                                                { text: '', border: [false, false, false, false] },
                                                { text: 'NRO. REGISTRO INTERNO (Correlativo)', border: [false, false, false, false] },
                                                { text: `${firstSend.sendings[0].numero_interno}`, fontSize: 9, alignment: 'center' },
                                            ]
                                        ]
                                    },
                                },
                                ],
                                [`REMITENTE: ${procedure.fullNameApplicant}`, `CARGO: P. ${procedure.solicitante.tipo}`],
                                ...sectionReceiver,
                                [{ text: `REFERENCIA: ${procedure.detalle}`, colSpan: 2 }]
                            ]
                        },
                        layout: 'noBorders'
                    }
                ],
                [
                    {
                        border: [true, false, true, false],
                        columns: [
                            {
                                width: 65,
                                text: ''
                            },

                            {
                                fontSize: 5,
                                alignment: 'center',
                                table: {
                                    widths: [95, 70, 60, 80],
                                    body: [
                                        [
                                            '',
                                            'FECHA',
                                            'HORA',
                                            'CANTIDAD DE HOJAS / ANEXOS'
                                        ],
                                        [
                                            { text: 'SALIDA', border: [false, false, false, false], fontSize: 7 },
                                            { text: `${moment(firstSend._id.fecha_envio).format('DD-MM-YYYY')}`, border: [true, true, true, true], fontSize: 8 },
                                            { text: `${moment(firstSend._id.fecha_envio).format(' HH:mm A')}`, border: [true, true, true, true], fontSize: 8 },
                                            { text: `${firstSend.sendings[0].cantidad}`, border: [true, true, true, true], fontSize: 6 }
                                        ]
                                    ]
                                },
                                layout: {
                                    defaultBorder: false,
                                }
                            },
                            {
                                width: 100,
                                text: ''
                            },
                        ]
                    },
                ]
            ]
        }
    }
}

export function createContainers(data: newWorkflow[]) {
    const cuadros: ContentTable[] = []
    for (let index = 0; index < data.length; index++) {
        if (data[index].sendings.length > 1) {
            break;
        }
        const sectionDates: TableCell[][] = []
        let sectionNumbers: TableCell[][] = []
        let destinatarios: string[] = []
        data[index].sendings.forEach((element) => {
            const nextSend = data.slice(index, data.length).find(send => send._id.cuenta === element.receptor.cuenta._id)
            const inDate = element.fecha_recibido
                ? { date: `${moment(element.fecha_recibido).format('DD-MM-YYYY')}`, hour: `${moment(element.fecha_recibido).format('HH:mm A')}` }
                : { date: '', hour: '' }
            const outDate = nextSend
                ? { date: `${moment(nextSend._id.fecha_envio).format('DD-MM-YYYY')}`, hour: `${moment(nextSend._id.fecha_envio).format('HH:mm A')}` }
                : { date: '', hour: '' }
            destinatarios.push(`${element.receptor.fullname} (${element.receptor.jobtitle})`)
            sectionDates.push(
                [
                    '',
                    'FECHA',
                    'HORA',
                    'CANTIDAD DE HOJAS / ANEXOS',
                    '',
                    'FECHA',
                    'HORA',
                    'CANTIDAD DE HOJAS / ANEXOS'
                ],
                [
                    { text: `INGRESO `, border: [false, false, false, false], fontSize: 7 },
                    { text: `${inDate.date}`, fontSize: 8, border: [true, true, true, true] },
                    { text: `${inDate.hour}`, fontSize: 8, border: [true, true, true, true] },
                    { text: `${element.cantidad}`, fontSize: 6, border: [true, true, true, true] },
                    { text: `SALIDA`, border: [false, false, false, false], fontSize: 7 },
                    { text: `${outDate.date}`, border: [true, true, true, true], fontSize: 8 },
                    { text: `${outDate.hour}`, border: [true, true, true, true], fontSize: 8 },
                    { text: `${nextSend ? nextSend.sendings[0].cantidad : ''}`, border: [true, true, true, true], fontSize: 6 }
                ]
            )
            sectionNumbers.push(
                [
                    { text: `NRO. REGISTRO INTERNO (Correlativo)`, border: [false, false, false, false] },
                    { text: `${nextSend ? nextSend.sendings[0].numero_interno : ''}` }
                ],
            )
        });
        sectionNumbers = [...sectionNumbers,
        [
            { text: '\n\n\n\n-----------------------------------------', colSpan: 2, border: [false, false, false, false], alignment: 'right' }
        ],
        [
            { text: 'FIRMA Y SELLO', colSpan: 2, border: [false, false, false, false], alignment: 'right' },
        ]]
        cuadros.push(
            {
                fontSize: 7,
                unbreakable: true,
                table: {
                    dontBreakRows: true,
                    widths: [360, '*'],
                    body: [
                        [{ margin: [0, 0, 0, 0], text: `DESTINATARIO ${ordinales.toOrdinal(index + 1)} (NOMBRE Y CARGO): ${destinatarios.join(' // ')}`.toUpperCase(), colSpan: 2, alignment: 'left', border: [true, false, true, false] }, ''],
                        [
                            {
                                border: [true, false, false, false],
                                table: {
                                    widths: [80, 300],
                                    body: [
                                        [
                                            {
                                                table: {
                                                    heights: 70,
                                                    widths: [70],
                                                    body: [
                                                        [{ text: 'SELLO DE RECEPCION', fontSize: 4, alignment: 'center' }]
                                                    ]
                                                },
                                            },
                                            [
                                                { text: 'INSTRUCCION / PROVEIDO' },
                                                { text: `\n\n${data[index].sendings[0].motivo}`, bold: true, alignment: 'center' }
                                            ]
                                        ]
                                    ]
                                },
                                layout: {
                                    defaultBorder: false,
                                }
                            },
                            {
                                rowSpan: 1,
                                border: [false, false, true, false],
                                table: {
                                    widths: [100, 40],
                                    body: sectionNumbers
                                }
                            }
                        ],
                        [
                            {
                                colSpan: 2,
                                border: [true, false, true, true],
                                alignment: 'center',
                                fontSize: 5,
                                table: {
                                    widths: [30, 45, 35, '*', 30, 45, 35, '*'],
                                    body: sectionDates
                                },
                                layout: {
                                    defaultBorder: false,
                                }
                            }
                        ]
                    ]
                }
            }
        )
    }
    cuadros[0].table.body.push([{ text: `SEGUNDA PARTE`, fontSize: 7, bold: true, alignment: 'left', border: [true, false, true, true], colSpan: 2 }, ''])
    return cuadros
}

export function createWhiteContainers(initRange: number, endRange: number) {
    const cuadros: ContentTable[] = []
    for (let index = initRange; index < endRange + 1; index++) {
        cuadros.push(
            {
                fontSize: 7,
                unbreakable: true,
                table: {
                    dontBreakRows: true,
                    widths: [360, '*'],
                    body: [
                        [{ margin: [0, 10, 0, 0], text: `DESTINATARIO ${ordinales.toOrdinal(index)} (NOMBRE Y CARGO):`.toUpperCase(), colSpan: 2, alignment: 'left', border: [true, false, true, false] }, ''],
                        [
                            {
                                border: [true, false, false, false],
                                table: {
                                    body: [
                                        [
                                            {
                                                table: {
                                                    heights: 70,
                                                    widths: [70],
                                                    body: [
                                                        [{ text: 'SELLO DE RECEPCION', fontSize: 4, alignment: 'center' }]
                                                    ]
                                                },
                                            },
                                            [
                                                { text: 'INSTRUCCION / PROVEIDO' },
                                                { text: ``, bold: true },
                                            ]
                                        ]
                                    ]
                                },
                                layout: {
                                    defaultBorder: false,
                                }
                            },
                            {
                                rowSpan: 1,
                                border: [false, false, true, false],
                                table: {
                                    widths: [100, 40],
                                    body: [
                                        [
                                            { text: 'NRO. REGISTRO INTERNO (Correlativo)', border: [false, false, false, false] },
                                            { text: `` }
                                        ],
                                        [
                                            { text: '\n\n\n\n-----------------------------------------', colSpan: 2, border: [false, false, false, false], alignment: 'right' }
                                        ],
                                        [
                                            { text: 'FIRMA Y SELLO', colSpan: 2, border: [false, false, false, false], alignment: 'right' },
                                        ]
                                    ]
                                }
                            }
                        ],
                        [
                            {
                                colSpan: 2,
                                border: [true, false, true, true],
                                alignment: 'center',
                                fontSize: 5,
                                table: {
                                    widths: [30, 45, 35, '*', 30, 45, 35, '*'],
                                    body: [
                                        [
                                            '',
                                            'FECHA',
                                            'HORA',
                                            'CANTIDAD DE HOJAS / ANEXOS',
                                            '',
                                            'FECHA',
                                            'HORA',
                                            'CANTIDAD DE HOJAS / ANEXOS'
                                        ],
                                        [
                                            { text: 'INGRESO', border: [false, false, false, false], fontSize: 7 },
                                            { text: ``, fontSize: 8, border: [true, true, true, true] },
                                            { text: ``, fontSize: 8, border: [true, true, true, true] },
                                            { text: ``, fontSize: 6, border: [true, true, true, true] },
                                            { text: 'SALIDA', border: [false, false, false, false], fontSize: 7 },
                                            { text: ``, border: [true, true, true, true], fontSize: 8 },
                                            { text: ``, border: [true, true, true, true], fontSize: 8 },
                                            { text: ``, border: [true, true, true, true], fontSize: 6 }
                                        ]]
                                },
                                layout: {
                                    defaultBorder: false,
                                }
                            }
                        ],

                    ]
                }
            }
        )
    }
    if (initRange === 1) {
        cuadros[0].table.body.push([{ text: `SEGUNDA PARTE`, fontSize: 7, bold: true, alignment: 'left', border: [true, false, true, true], colSpan: 2 }, ''])
    }
    return cuadros
}



export function createRouteMap(content: Content[]) {
    const docDefinition: TDocumentDefinitions = {
        pageSize: 'LETTER',
        pageMargins: [30, 30, 30, 30],
        content: content,
        footer: [
            { text: 'NOTA: Esta hoja de ruta de correspondencia, no debera ser separada ni extraviada del documento del cual se encuentra adherida, por constituirse parte indivisible del mismo', margin: [30, -2], fontSize: 7, bold: true },
            { text: 'Direccion: Plaza 6 de agosto E-0415 - Telefono: No. Piloto 4701677 - 4702301 - 4703059 - Fax interno: 143', fontSize: 7, color: '#BC6C25', margin: [30, 1] },
            { text: 'E-mail: info@sacaba.gob.bo - Pagina web: www.sacaba.gob.bo', fontSize: 7, pageBreak: 'after', color: '#BC6C25', margin: [30, 1] },
        ],
        styles: {
            cabecera: {
                margin: [0, 0, 0, 10]
            },
            header: {
                fontSize: 10,
                bold: true,
            },
            tableExample: {
                fontSize: 8,
                alignment: 'center',
                margin: [0, 0, 0, 5]
            },
            selection_container: {
                fontSize: 7,
                alignment: 'center',
                margin: [0, 10, 0, 0]
            }
        }
    }
    pdfMake.createPdf(docDefinition).print();
}