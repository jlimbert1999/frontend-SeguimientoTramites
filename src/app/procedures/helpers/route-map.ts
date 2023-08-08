import { Content, ContentTable, TDocumentDefinitions, TableCell } from "pdfmake/interfaces"
import { convertirImagenABase64 } from "src/app/helpers/pdf/imageBase64"
import * as moment from "moment"
import { ExternalDetail } from "../models/externo.model"
import * as pdfMake from "pdfmake/build/pdfmake"
import { InternalDetail } from "../models/interno.model"
import { newWorkflow } from "src/app/communication/interfaces/workflow.interface"
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

export function createFirstContainerExternal(procedure: ExternalDetail, firstSend?: newWorkflow): ContentTable {
    const sectionReceiver: TableCell[] = []
    const firstSendDetails = {
        date: '',
        hour: '',
        quantity: '',
        inNumber: ''
    }
    if (firstSend) {
        // firstSend.sendings.forEach(dest => {
        //     sectionReceiver.push([`DESTINATARIO: ${dest.receptor.fullname}`, `CARGO: ${dest.receptor.jobtitle}`])
        // })
        sectionReceiver.push([`DESTINATARIO: ${firstSend.sendings[0].receptor.fullname}`, `CARGO: ${firstSend.sendings[0].receptor.jobtitle}`])
        firstSendDetails.quantity = firstSend.sendings[0].cantidad
        firstSendDetails.inNumber = firstSend.sendings[0].numero_interno
        firstSendDetails.date = moment(firstSend._id.fecha_envio).format('DD-MM-YYYY')
        firstSendDetails.hour = moment(firstSend._id.fecha_envio).format('HH:mm A')
    }
    else {
        sectionReceiver.push([`DESTINATARIO:`, `CARGO:`])
    }
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
                                [`CITE: ${procedure.cite} / TEL.: ${procedure.solicitante.telefono}`,
                                {
                                    table: {
                                        widths: [85, 100, 40],
                                        body: [
                                            [
                                                { text: '', border: [false, false, false, false] },
                                                { text: 'NRO. REGISTRO INTERNO (Correlativo)', border: [false, false, false, false] },
                                                { text: `${firstSendDetails.inNumber}`, fontSize: 9, alignment: 'center' },
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
                                            { text: `${firstSendDetails.date}`, border: [true, true, true, true], fontSize: 8 },
                                            { text: `${firstSendDetails.hour}`, border: [true, true, true, true], fontSize: 8 },
                                            { text: `${firstSendDetails.quantity}`, border: [true, true, true, true], fontSize: 6 }
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
export function createFirstContainerInternal(procedure: InternalDetail, firstSend?: newWorkflow): ContentTable {
    const firstSendDetails = {
        date: '',
        hour: '',
        quantity: '',
        inNumber: ''
    }
    if (firstSend) {
        firstSendDetails.quantity = firstSend.sendings[0].cantidad
        firstSendDetails.inNumber = firstSend.sendings[0].numero_interno
        firstSendDetails.date = moment(firstSend._id.fecha_envio).format('DD-MM-YYYY')
        firstSendDetails.hour = moment(firstSend._id.fecha_envio).format('HH:mm A')
    }
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
                                [`CITE: ${procedure.cite}`,
                                {
                                    table: {
                                        widths: [85, 100, 40],
                                        body: [
                                            [
                                                { text: '', border: [false, false, false, false] },
                                                { text: 'NRO. REGISTRO INTERNO (Correlativo)', border: [false, false, false, false] },
                                                { text: `${firstSendDetails.inNumber}`, fontSize: 9, alignment: 'center' },
                                            ]
                                        ]
                                    },
                                },
                                ],
                                [`REMITENTE: ${procedure.remitente.nombre}`, `CARGO: ${procedure.remitente.cargo}`],
                                [`DESTINATARIO: ${procedure.destinatario.nombre}`, `CARGO: ${procedure.destinatario.cargo}`],
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
                                            { text: `${firstSendDetails.date}`, border: [true, true, true, true], fontSize: 8 },
                                            { text: `${firstSendDetails.hour}`, border: [true, true, true, true], fontSize: 8 },
                                            { text: `${firstSendDetails.quantity}`, border: [true, true, true, true], fontSize: 6 }
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
        const receivers: string[] = []
        const sectionDates: TableCell[][] = []
        const sectionNumbers: TableCell[][] = []
        if (data[index].sendings.length > 1) {
            data[index].sendings.forEach((element) => {
                receivers.push(`${element.receptor.fullname} (${element.receptor.jobtitle})`)
            });
            break;
        }
        data[index].sendings.forEach((send) => {
            receivers.push(`${send.receptor.fullname} (${send.receptor.jobtitle})`)
            const inDetails = send.fecha_recibido
                ? {
                    date: moment(send.fecha_recibido).format('DD-MM-YYYY'),
                    hour: moment(send.fecha_recibido).format('HH:mm A'),
                    quantity: send.cantidad,
                    inNumber: send.numero_interno
                }
                : { date: '', hour: '', inNumber: '', quantity: '' };
            const nextSend = data.slice(index, data.length).find(flow => flow._id.cuenta === send.receptor.cuenta._id)
            const outDetails = nextSend
                ? {
                    date: `${moment(nextSend._id.fecha_envio).format('DD-MM-YYYY')}`,
                    hour: `${moment(nextSend._id.fecha_envio).format('HH:mm A')}`,
                    quantity: nextSend.sendings[0].cantidad,
                    inNumber: nextSend.sendings[0].numero_interno
                }
                : { date: '', hour: '', quantity: '', inNumber: '' }
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
                    { text: `${inDetails.date}`, fontSize: 8, border: [true, true, true, true] },
                    { text: `${inDetails.hour}`, fontSize: 8, border: [true, true, true, true] },
                    { text: `${inDetails.quantity}`, fontSize: 6, border: [true, true, true, true] },
                    { text: `SALIDA`, border: [false, false, false, false], fontSize: 7 },
                    { text: `${outDetails.date}`, border: [true, true, true, true], fontSize: 8 },
                    { text: `${outDetails.hour}`, border: [true, true, true, true], fontSize: 8 },
                    { text: `${outDetails.quantity}`, border: [true, true, true, true], fontSize: 6 }
                ]
            )
            sectionNumbers.push(
                [
                    { text: `NRO. REGISTRO INTERNO (Correlativo)`, border: [false, false, false, false] },
                    { text: `${outDetails.inNumber}`, alignment: 'center' }
                ],
            )
        });
        sectionNumbers.push([
            { text: '\n\n\n\n-----------------------------------------', colSpan: 2, border: [false, false, false, false], alignment: 'right' }
        ],
            [
                { text: 'FIRMA Y SELLO', colSpan: 2, border: [false, false, false, false], alignment: 'right' },
            ]
        )
        cuadros.push(
            {
                fontSize: 7,
                unbreakable: true,
                table: {
                    dontBreakRows: true,
                    widths: [360, '*'],
                    body: [
                        [{ margin: [0, 0, 0, 0], text: `DESTINATARIO ${ordinales.toOrdinal(index + 1)} (NOMBRE Y CARGO): ${receivers.join(' // ')}`.toUpperCase(), colSpan: 2, alignment: 'left', border: [true, false, true, false] }, ''],
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
    for (let index = initRange + 1; index <= endRange; index++) {
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
    if (initRange === 0) {
        cuadros[0].table.body.push([{ text: `SEGUNDA PARTE`, fontSize: 7, bold: true, alignment: 'left', border: [true, false, true, true], colSpan: 2 }, ''])
    }
    return cuadros
}

export function getLastPageNumber(lengthData: number): number {
    if (lengthData <= 8) return 8
    const firstTerm = 3;
    const increment = 5;
    const termsBefore = Math.ceil((lengthData - firstTerm) / increment);
    const nextTerm = firstTerm + termsBefore * increment;
    return nextTerm;
}


export async function createRouteMap(content: Content[]) {
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