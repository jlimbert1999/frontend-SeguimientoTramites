import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from "pdfmake/interfaces";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import { Externo } from "../../Tramites/models/Externo.interface";
import { WorkflowData } from "src/app/Bandejas/models/workflow.interface";
const ordinales = require("ordinales-js");

export const HojaRutaExterna = async (tramite: Externo, workflow: WorkflowData[], id_cuenta: string) => {
    const logo: any = await getBase64ImageFromUrl('../../../assets/img/logo_alcaldia2.jpeg')
    let docDefinition: TDocumentDefinitions
    let checkType = ['', '', '']
    let solicitante: string = tramite.solicitante.tipo === 'NATURAL' ? `${tramite.solicitante.nombre} ${tramite.solicitante.paterno} ${tramite.solicitante.materno}` : `${tramite.solicitante.nombre}`
    let cuadrados: any[] = []
    console.log(workflow);
    if (workflow.length > 0) {

        if (id_cuenta === tramite.cuenta._id) {
            let destinatarios = ''
            for (let index = 0; index < workflow.length; index++) {
                if (id_cuenta == workflow[index].emisor.cuenta._id) {
                    destinatarios = destinatarios + `${workflow[index].receptor.funcionario.nombre} ${workflow[index].receptor.funcionario.paterno} ${workflow[index].receptor.funcionario.materno} (${workflow[index].receptor.funcionario.cargo}) // `
                }
                else {
                    break
                }
            }
            cuadrados.push(
                {
                    fontSize: 7,
                    unbreakable: true,
                    table: {
                        dontBreakRows: true,
                        widths: [360, '*'],
                        body: [
                            [{ margin: [0, 10, 0, 0], text: `DESTINATARIO ${ordinales.toOrdinal(1)}: ${destinatarios}`.toUpperCase(), colSpan: 2, alignment: 'left', border: [true, false, true, false] }, ''],
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
                                                    { text: `${workflow[0].motivo}`, bold: true },
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
                                            ]
                                        ]
                                    },
                                    layout: {
                                        defaultBorder: false,
                                    }
                                }
                            ],
                            [{ text: `SEGUNDA PARTE`, colSpan: 2, fontSize: 7, bold: true, alignment: 'left', border: [true, false, true, true] }, '']

                        ]
                    }
                }
            )
            for (let index = 1; index < 8; index++) {
                cuadrados.push(
                    {
                        fontSize: 7,
                        unbreakable: true,
                        table: {
                            dontBreakRows: true,
                            widths: [360, '*'],
                            body: [
                                [{ margin: [0, 10, 0, 0], text: `DESTINATARIO: ${ordinales.toOrdinal(index + 1)}:`.toUpperCase(), colSpan: 2, alignment: 'left', border: [true, false, true, false] }, ''],
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
                                                ]
                                            ]
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
                if (index === 0) {
                    cuadrados[0].table.body.push([{ text: `SEGUNDA PARTE`, colSpan: 2, fontSize: 7, bold: true, alignment: 'left', border: [true, false, true, true] }, ''])
                }
            }
            docDefinition = {
                pageSize: 'LETTER',
                pageMargins: [30, 30, 30, 30],
                content: [
                    {
                        style: 'cabecera',
                        columns: [
                            {
                                image: logo,
                                width: 150,
                                height: 60,
                            },
                            {
                                text: '\nHOJA DE RUTA DE CORRESPONDENCIA',
                                bold: true,
                                alignment: 'center',
                                width: 300,

                            },
                            {
                                text: ''
                            }
                        ]
                    },
                    {
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
                                                            { text: checkType[0], style: 'header' }
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
                                                            { text: checkType[1], style: 'header' }
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
                                                            { text: checkType[2], style: 'header' }
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
                                                            { text: `${tramite.alterno}`, bold: true, fontSize: 11 }
                                                        ]
                                                    ]
                                                }
                                            },
                                        ]
                                    },
                                ],
                                // EMISION 
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
                                                            { text: `${moment(new Date(tramite.fecha_registro)).format('DD-MM-YYYY')}`, fontSize: 8, border: [true, true, true, true] },
                                                            { text: `${moment(new Date(tramite.fecha_registro)).format('HH:mm A')}`, fontSize: 8, border: [true, true, true, true] },
                                                            { text: `${tramite.cantidad}`, fontSize: 6, border: [true, true, true, true] },
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
                                                [`${tramite.cite !== '' ? 'CITE: ' + tramite.cite : ''}    |    TEL.: ${tramite.solicitante.telefono}`,
                                                {
                                                    table: {
                                                        widths: [85, 100, 40],
                                                        body: [
                                                            [
                                                                { text: '', border: [false, false, false, false] },
                                                                { text: 'NRO. REGISTRO INTERNO (Correlativo)', border: [false, false, false, false] },
                                                                { text: `${workflow[0].numero_interno}`, fontSize: 9, alignment: 'center' },
                                                            ]
                                                        ]
                                                    },
                                                },
                                                ],
                                                [`REMITENTE: ${solicitante}`, `CARGO: P. ${tramite.solicitante.tipo}`],
                                                [`DESTINATARIO: `, `CARGO:`],
                                                [{ text: `REFERENCIA:`, colSpan: 2 }]
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
                                                            { text: `${moment(workflow[0].fecha_envio).format('DD-MM-YYYY')}`, border: [true, true, true, true], fontSize: 8 },
                                                            { text: `${moment(workflow[0].fecha_envio).format('HH:mm A')}`, border: [true, true, true, true], fontSize: 8 },
                                                            { text: `${workflow[0].cantidad}`, border: [true, true, true, true], fontSize: 6 }
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
                    },
                    cuadrados
                ],
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
        else {
            workflow = workflow.filter(element => element.recibido === true)
            let way: WorkflowData[] = []
            let head = id_cuenta
            workflow = workflow.reverse()
            const indexRoot = workflow.findIndex(item => item.receptor.cuenta._id === id_cuenta)
            for (let index = indexRoot; index < workflow.length; index++) {
                if (workflow[index].receptor.cuenta._id === head) {
                    head = workflow[index].emisor.cuenta._id
                    way.push(workflow[index])
                }
            }
            way = way.reverse()
            way.forEach((flujo, index) => {
                let next
                if (way[index + 1]) {
                    next = {
                        motivo: way[index + 1].motivo,
                        numero_interno: way[index + 1].numero_interno,
                        fecha: moment(way[index + 1].fecha_envio).format('DD-MM-YYYY'),
                        hora: moment(way[index + 1].fecha_envio).format('HH:mm A'),
                        cantidad: flujo.cantidad
                    }
                }
                else {
                    next = {
                        motivo: '',
                        numero_interno: '',
                        fecha: '',
                        hora: '',
                        cantidad: ''
                    }
                }
                cuadrados.push(
                    {
                        fontSize: 7,
                        unbreakable: true,
                        table: {
                            dontBreakRows: true,
                            widths: [360, '*'],
                            body: [
                                [{ margin: [0, 10, 0, 0], text: `DESTINATARIO: ${ordinales.toOrdinal(1)}: ${flujo.receptor.funcionario.nombre} ${flujo.receptor.funcionario.paterno} ${flujo.receptor.funcionario.materno} (${flujo.receptor.funcionario.cargo})`.toUpperCase(), colSpan: 2, alignment: 'left', border: [true, false, true, false] }, ''],
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
                                                        { text: `${next.motivo}`, bold: true },
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
                                                    { text: `${next.numero_interno}` }
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
                                                    { text: `${moment(flujo.fecha_recibido).format('DD-MM-YYYY')}`, fontSize: 8, border: [true, true, true, true] },
                                                    { text: `${moment(flujo.fecha_recibido).format('HH:mm A')}`, fontSize: 8, border: [true, true, true, true] },
                                                    { text: `${flujo.cantidad}`, fontSize: 6, border: [true, true, true, true] },
                                                    { text: 'SALIDA', border: [false, false, false, false], fontSize: 7 },
                                                    { text: `${next.fecha}`, border: [true, true, true, true], fontSize: 8 },
                                                    { text: `${next.hora}`, border: [true, true, true, true], fontSize: 8 },
                                                    { text: `${next.cantidad}`, border: [true, true, true, true], fontSize: 6 }
                                                ]
                                            ]
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
                if (index === 0) {
                    cuadrados[0].table.body.push([{ text: `SEGUNDA PARTE`, colSpan: 2, fontSize: 7, bold: true, alignment: 'left', border: [true, false, true, true] }, ''])
                }
            })

            let numerPages = 0
            if (way.length < 8) {

            }
            else {
                numerPages = (workflow.length - 3) / 5
            }



            docDefinition = {
                pageSize: 'LETTER',
                pageMargins: [30, 30, 30, 30],
                content: [
                    {
                        style: 'cabecera',
                        columns: [
                            {
                                image: logo,
                                width: 150,
                                height: 60,
                            },
                            {
                                text: '\nHOJA DE RUTA DE CORRESPONDENCIA',
                                bold: true,
                                alignment: 'center',
                                width: 300,

                            },
                            {
                                text: ''
                            }
                        ]
                    },
                    {
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
                                                            { text: checkType[0], style: 'header' }
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
                                                            { text: checkType[1], style: 'header' }
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
                                                            { text: checkType[2], style: 'header' }
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
                                                            { text: `${tramite.alterno}`, bold: true, fontSize: 11 }
                                                        ]
                                                    ]
                                                }
                                            },
                                        ]
                                    },
                                ],
                                // EMISION 
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
                                                            { text: `${moment(new Date(tramite.fecha_registro)).format('DD-MM-YYYY')}`, fontSize: 8, border: [true, true, true, true] },
                                                            { text: `${moment(new Date(tramite.fecha_registro)).format('HH:mm A')}`, fontSize: 8, border: [true, true, true, true] },
                                                            { text: `${tramite.cantidad}`, fontSize: 6, border: [true, true, true, true] },
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
                                                [`${tramite.cite !== '' ? 'CITE: ' + tramite.cite : ''}    |    TEL.: ${tramite.solicitante.telefono}`,
                                                {
                                                    table: {
                                                        widths: [85, 100, 40],
                                                        body: [
                                                            [
                                                                { text: '', border: [false, false, false, false] },
                                                                { text: 'NRO. REGISTRO INTERNO (Correlativo)', border: [false, false, false, false] },
                                                                { text: `${way[0].numero_interno}`, fontSize: 9, alignment: 'center' },
                                                            ]
                                                        ]
                                                    },
                                                },
                                                ],
                                                [`REMITENTE: ${solicitante}`, `CARGO: P. ${tramite.solicitante.tipo}`],
                                                [`DESTINATARIO: ${way[0].receptor.funcionario.nombre} ${way[0].receptor.funcionario.paterno} ${way[0].receptor.funcionario.materno}`, `CARGO: ${way[0].receptor.funcionario.cargo}`],
                                                [{ text: `REFERENCIA: ${way[0].motivo}`, colSpan: 2 }]
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
                                                            { text: `${moment(way[0].fecha_envio).format('DD-MM-YYYY')}`, border: [true, true, true, true], fontSize: 8 },
                                                            { text: `${moment(way[0].fecha_envio).format('HH:mm A')}`, border: [true, true, true, true], fontSize: 8 },
                                                            { text: `${way[0].cantidad}`, border: [true, true, true, true], fontSize: 6 }
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
                                ],
                            ]
                        }
                    },
                    cuadrados
                ],
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
    }
    else {
        for (let index = 0; index < 8; index++) {
            cuadrados.push(
                {
                    fontSize: 7,
                    unbreakable: true,
                    table: {
                        dontBreakRows: true,
                        widths: [360, '*'],
                        body: [
                            [{ margin: [0, 10, 0, 0], text: `DESTINATARIO: ${ordinales.toOrdinal(index + 1)}:`.toUpperCase(), colSpan: 2, alignment: 'left', border: [true, false, true, false] }, ''],
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
                                            ]
                                        ]
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
            if (index === 0) {
                cuadrados[0].table.body.push([{ text: `SEGUNDA PARTE`, colSpan: 2, fontSize: 7, bold: true, alignment: 'left', border: [true, false, true, true] }, ''])
            }
        }
        docDefinition = {
            pageSize: 'LETTER',
            pageMargins: [30, 30, 30, 30],
            content: [
                {
                    style: 'cabecera',
                    columns: [
                        {
                            image: logo,
                            width: 150,
                            height: 60,
                        },
                        {
                            text: '\nHOJA DE RUTA DE CORRESPONDENCIA',
                            bold: true,
                            alignment: 'center',
                            width: 300,

                        },
                        {
                            text: ''
                        }
                    ]
                },
                {
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
                                                        { text: checkType[0], style: 'header' }
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
                                                        { text: checkType[1], style: 'header' }
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
                                                        { text: checkType[2], style: 'header' }
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
                                                        { text: `${tramite.alterno}`, bold: true, fontSize: 11 }
                                                    ]
                                                ]
                                            }
                                        },
                                    ]
                                },
                            ],
                            // EMISION 
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
                                                        { text: `${moment(new Date(tramite.fecha_registro)).format('DD-MM-YYYY')}`, fontSize: 8, border: [true, true, true, true] },
                                                        { text: `${moment(new Date(tramite.fecha_registro)).format('HH:mm A')}`, fontSize: 8, border: [true, true, true, true] },
                                                        { text: `${tramite.cantidad}`, fontSize: 6, border: [true, true, true, true] },
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
                                            [`${tramite.cite !== '' ? 'CITE: ' + tramite.cite : ''}    |    TEL.: ${tramite.solicitante.telefono}`,
                                            {
                                                table: {
                                                    widths: [85, 100, 40],
                                                    body: [
                                                        [
                                                            { text: '', border: [false, false, false, false] },
                                                            { text: 'NRO. REGISTRO INTERNO (Correlativo)', border: [false, false, false, false] },
                                                            { text: ``, fontSize: 9, alignment: 'center' },
                                                        ]
                                                    ]
                                                },
                                            },
                                            ],
                                            [`REMITENTE: ${solicitante}`, `CARGO: P. ${tramite.solicitante.tipo}`],
                                            [`DESTINATARIO: `, `CARGO:`],
                                            [{ text: `REFERENCIA:`, colSpan: 2 }]
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
                                                        { text: ``, border: [true, true, true, true], fontSize: 8 },
                                                        { text: ``, border: [true, true, true, true], fontSize: 8 },
                                                        { text: ``, border: [true, true, true, true], fontSize: 6 }
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
                },
                cuadrados
            ],
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
}

const getBase64ImageFromUrl = async (imageUrl: string) => {
    var res = await fetch(imageUrl);
    var blob = await res.blob();
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.addEventListener("load", function () {
            resolve(reader.result);
        }, false);
        reader.readAsDataURL(blob);
    })
}

