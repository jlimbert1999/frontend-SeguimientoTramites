import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, TDocumentDefinitions } from "pdfmake/interfaces";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import { AllInfoOneExterno, ExternoData } from "../models/externo.model";
const ordinales = require("ordinales-js");

export const HojaRuta = async (tramite: AllInfoOneExterno, workflow: any[]) => {
    const img1: any = await getBase64ImageFromUrl('../../../assets/img/logo_alcaldia2.jpeg')
    workflow = workflow.filter(flujo => flujo.recibido === true || flujo.recibido === undefined)
    let docDefinition: TDocumentDefinitions
    let checkType = ['', 'X', '']
    let NameSolicitante: string = tramite.solicitante.tipo === 'NATURAL' ? `${tramite.solicitante.nombre} ${tramite.solicitante.paterno} ${tramite.solicitante.materno}` : `${tramite.solicitante.nombre}`
    let cuadrados: Content[] = []
    let destinatario: any
    let initNumberPage, endNumberPage

    if (workflow.length === 0) {
        cuadrados.push(
            {
                fontSize: 7,
                unbreakable: true,
                table: {
                    dontBreakRows: true,
                    widths: [360, '*'],
                    body: [
                        [{ margin: [0, 10, 0, 0], text: `DESTINATARIO: ${ordinales.toOrdinal(1)}:                                                                              `.toUpperCase(), colSpan: 2, decoration: 'underline', alignment: 'left', border: [true, false, true, false] }, ''],

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
                                            { text: '' }
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
                                            { text: '', border: [true, true, true, true], fontSize: 8 },
                                            { text: '', border: [true, true, true, true], fontSize: 8 },
                                            { text: '', border: [true, true, true, true], fontSize: 6 }
                                        ]

                                    ]
                                },
                                layout: {
                                    defaultBorder: false,
                                }
                            }


                        ],
                        [{ text: `SEGUNDA PARTE`, colSpan: 2, fontSize: 7, bold: true, alignment: 'left', border: [true, false, true, true] }, ''],
                    ]
                }
            }
        )
        initNumberPage = 1
        endNumberPage = 8
        destinatario = {
            nombre: '....................................................',
            cargo: '.....................................................',
            salida: ['', '', ''],
            numero_interno: ''
        }

    }
    else {
        destinatario = {
            nombre: `${workflow[0].receptor.funcionario}`,
            cargo: workflow[0].receptor.cargo,
            salida: [moment(workflow[0].fecha_envio).format('DD-MM-YYYY'), moment(workflow[0].fecha_envio).format('HH:mm A'), workflow[0].cantidad],
            numero_interno: workflow[0].numero_interno
        }
        let salida = ['', '', '', '']
        let ingreso = ['', '', '']
        switch (workflow[0].recibido) {
            case true:
                ingreso[0] = moment(new Date(workflow[0].fecha_recibido)).format('DD-MM-YYYY')
                ingreso[1] = moment(new Date(workflow[0].fecha_recibido)).format('HH:mm A')
                ingreso[2] = workflow[0].cantidad
                break;
            default:
                ingreso[0] = ''
                ingreso[1] = ''
                ingreso[2] = ''
                break;
        }
        if (workflow[1]) {
            salida[0] = moment(new Date(workflow[1].fecha_envio)).format('DD-MM-YYYY')
            salida[1] = moment(new Date(workflow[1].fecha_envio)).format('HH:mm A')
            salida[2] = workflow[1].cantidad
            salida[3] = workflow[1].numero_interno
        }
        else {
            salida[0] = ""
            salida[1] = ""
            salida[2] = ""
            salida[3] = ""
        }
        cuadrados.push(
            {
                fontSize: 7,
                unbreakable: true,
                table: {
                    dontBreakRows: true,
                    widths: [360, '*'],
                    body: [
                        [{ margin: [0, 10, 0, 0], text: `DESTINATARIO: ${ordinales.toOrdinal(1)} ${workflow[0].receptor.funcionario} (${workflow[0].receptor.cargo})`.toUpperCase(), decoration: 'underline', colSpan: 2, alignment: 'left', border: [true, false, true, false] }, ''],
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
                                            { text: `${salida[3]}`, fontSize: 9 }
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
                                            { text: `${ingreso[0]}`, fontSize: 8, border: [true, true, true, true] },
                                            { text: `${ingreso[1]}`, fontSize: 8, border: [true, true, true, true] },
                                            { text: `${ingreso[2]}`, fontSize: 6, border: [true, true, true, true] },
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
                            }
                        ],
                        [{ text: `SEGUNDA PARTE`, colSpan: 2, fontSize: 7, bold: true, alignment: 'left', border: [true, false, true, true] }, ''],
                    ]
                }
            }
        )
        for (let index = 1; index < workflow.length; index++) {
            switch (workflow[index].recibido) {
                case true:
                    ingreso[0] = moment(new Date(workflow[index].fecha_recibido)).format('DD-MM-YYYY')
                    ingreso[1] = moment(new Date(workflow[index].fecha_recibido)).format('HH:mm A')
                    ingreso[2] = workflow[index].cantidad
                    break;
                default:
                    ingreso[0] = ''
                    ingreso[1] = ''
                    ingreso[2] = ''
                    break;
            }
            if (workflow[index + 1]) {
                salida[0] = moment(new Date(workflow[index + 1].fecha_envio)).format('DD-MM-YYYY')
                salida[1] = moment(new Date(workflow[index + 1].fecha_envio)).format('HH:mm A')
                salida[2] = workflow[index + 1].cantidad
                salida[3] = workflow[index + 1].numero_interno
            }
            else {
                salida[0] = ""
                salida[1] = ""
                salida[2] = ""
                salida[3] = ""
            }

            cuadrados.push({
                unbreakable: true,
                fontSize: 7,
                table: {
                    headerRows: 1,
                    dontBreakRows: true,
                    widths: [360, '*'],
                    body: [
                        [{ margin: [0, 10, 0, 0], text: `DESTINATARIO: ${ordinales.toOrdinal(index + 1)} ${workflow[index].receptor.funcionario} (${workflow[index].receptor.cargo})`.toUpperCase(), decoration: 'underline', colSpan: 2, alignment: 'left', border: [true, false, true, false] }, ''],
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
                                                { text: `${workflow[index].motivo}`, bold: true },
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
                                            { text: `${salida[3]}`, fontSize: 9 }
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
                                            { text: `${ingreso[0]}`, fontSize: 8, border: [true, true, true, true] },
                                            { text: `${ingreso[1]}`, fontSize: 8, border: [true, true, true, true] },
                                            { text: `${ingreso[2]}`, fontSize: 6, border: [true, true, true, true] },
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
                            }
                        ],
                    ]
                }
            })
        }
        initNumberPage = workflow.length
        endNumberPage = 8
    }
    for (let index = initNumberPage; index < endNumberPage; index++) {
        cuadrados.push({
            fontSize: 7,
            unbreakable: true,
            table: {
                dontBreakRows: true,
                widths: [360, '*'],
                body: [
                    [{ margin: [0, 10, 0, 0], text: `DESTINATARIO: ${ordinales.toOrdinal(index + 1)}                                                                               `.toUpperCase(), decoration: 'underline', colSpan: 2, alignment: 'left', border: [true, true, true, false] }, ''],
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
                                        { text: '' }
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
                                        { text: '', border: [true, true, true, true], fontSize: 8 },
                                        { text: '', border: [true, true, true, true], fontSize: 8 },
                                        { text: '', border: [true, true, true, true], fontSize: 6 }
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
        })

    }

    docDefinition = {
        pageSize: 'LETTER',
        pageMargins: [30, 30, 30, 30],
        content: [
            {
                style: 'cabecera',
                columns: [
                    {
                        image: img1,
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
                                                        { text: `${destinatario.numero_interno}`, fontSize: 9, alignment: 'center' },
                                                    ]
                                                ]
                                            },
                                            
                                        },
                                        ],
                                        [`REMITENTE: ${NameSolicitante}`, `CARGO: P. ${tramite.solicitante.tipo}`],
                                        [`DESTINATARIO: ${destinatario.nombre}`, `CARGO:${destinatario.cargo}`],
                                        [{ text: `REFERENCIA: ${tramite.detalle}`, colSpan: 2 }]
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
                                                    { text: `${destinatario.salida[0]}`, border: [true, true, true, true], fontSize: 8 },
                                                    { text: `${destinatario.salida[1]}`, border: [true, true, true, true], fontSize: 8 },
                                                    { text: `${destinatario.salida[2]}`, border: [true, true, true, true], fontSize: 6 }
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

