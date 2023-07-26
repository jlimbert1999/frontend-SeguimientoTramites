import { Content, ContentTable, TableCell } from "pdfmake/interfaces"
import { convertirImagenABase64 } from "src/app/helpers/pdf/imageBase64"
import { external } from "../interfaces/external.interface"
import * as moment from "moment"
import { ExternalDetail } from "../models/externo.model"

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
                    image: await convertirImagenABase64('../../../assets/img/logo_alcaldia.png'),
                    width: 70,
                    height: 70,
                },
            ]
        }
    ]
}


function createFirstContainerExternal(procedure: ExternalDetail, destinatarios: { nombre_completo: string, cargo: string }[], salida: [string, string, string, string]): ContentTable {
    let sectionReceiver: TableCell[] = []
    destinatarios.forEach(dest => {
        sectionReceiver.push([`DESTINATARIO: ${dest.nombre_completo}`, `CARGO: ${dest.cargo}`])
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
                                                { text: `${salida[3]}`, fontSize: 9, alignment: 'center' },
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
                                            { text: `${salida[0]}`, border: [true, true, true, true], fontSize: 8 },
                                            { text: `${salida[1]}`, border: [true, true, true, true], fontSize: 8 },
                                            { text: `${salida[2]}`, border: [true, true, true, true], fontSize: 6 }
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