import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from "pdfmake/interfaces";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';


export const crear_ficha_tramite = async (tipo_tramite: string, fecha_registro: string, alterno: string, pin: number, solicitante: string, dni: string, documento: string, tipo: 'NATURAL' | 'JURIDICO') => {
    const imagePath_Alcaldia: any = await getBase64ImageFromUrl('../../../assets/img/logo_alcaldia.png')
    let docDefinition: TDocumentDefinitions
    if (tipo === 'NATURAL') {
        docDefinition = {
            pageSize: 'A6',
            content: [
                {
                    image: imagePath_Alcaldia,
                    width: 90,
                    height: 90,
                    alignment: 'center'
                },
                {
                    text: 'GOBIERNO AUTONOMO MUNICIPAL DE SACABA.\n\n',
                    alignment: 'center'
                },
                {
                    text: `Tipo de tramite: ${tipo_tramite}\n\n`,
                    alignment: 'center'
                },
                {
                    text: `Fecha registro:  ${moment(new Date(fecha_registro)).format('DD-MM-YYYY HH:mm:ss')}\n\n`,
                    alignment: 'center'
                },
                {
                    text: `Alterno: ${alterno}\n\n`,
                    alignment: 'center'
                },
                {
                    text: `PIN: ${pin}\n\n`,
                    alignment: 'center'
                },
                {
                    text: `Solicitante: ${solicitante} ${documento} - ${dni}\n\n`,
                    alignment: 'center'
                },

            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'justify'
                }
            }
        };
    }
    else {
        docDefinition = {
            pageSize: 'A6',
            content: [
                {
                    image: imagePath_Alcaldia,
                    width: 90,
                    height: 90,
                    alignment: 'center'
                },
                {
                    text: 'GOBIERNO AUTONOMO MUNICIPAL DE SACABA.\n\n',
                    alignment: 'center'
                },
                {
                    text: `Tipo de tramite: ${tipo_tramite}\n\n`,
                    alignment: 'center'
                },
                {
                    text: `Fecha registro:  ${moment(new Date(fecha_registro)).format('DD-MM-YYYY HH:mm:ss')}\n\n`,
                    alignment: 'center'
                },
                {
                    text: `Alterno: ${alterno}\n\n`,
                    alignment: 'center'
                },
                {
                    text: `PIN: ${pin}\n\n`,
                    alignment: 'center'
                },
                {
                    text: `Solicitante: ${solicitante}`,
                    alignment: 'center'
                },
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'justify'
                }
            }
        };
    }

    pdfMake.createPdf(docDefinition).print();
}


export const crear_hoja_ruta = async () => {
    let iteraciones = []
    for (let index = 0; index < 3; index++) {
        iteraciones.push({
            fontSize: 10,
            table: {
                widths: ['*', '*'],
                body: [
                    [{ text: '\tDESTINATARIO:', colSpan: 2, alignment: 'left', border: [false, false, false, false] }, ''],
                    [
                        {
                            border: [true, true, false, false],
                            table: {
                                heights: [80],
                                body: [
                                    [
                                        {

                                            table: {
                                                heights: 80,
                                                widths: [80],
                                                body: [
                                                    ['']
                                                ]
                                            },
                                        },
                                        [
                                            { text: 'Intruccion proveido' },
                                            { text: 'ingresar' },
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
                            border: [false, true, true, false],
                            table: {
                                widths: [180, 60],
                                body: [
                                    [
                                        { text: 'NRO. REGISTRO INTERNO (Correlativo)', border: [false, false, false, false] },
                                        { text: 'fechaaa' }
                                    ],
                                    [
                                        { text: '\n\n\n\n-----------------------------------------', colSpan: 2, border: [false, false, false, false], alignment: 'center' }
                                    ],
                                    [
                                        { text: 'Firm y sello', colSpan: 2, border: [false, false, false, false], alignment: 'center' }

                                    ]
                                ]
                            }
                        },
                    ],
                    [
                        {
                            border: [true, false, false, true],
                            style: 'tableExample',
                            table: {
                                widths: [95, 70, 70],
                                body: [
                                    [
                                        '',
                                        'Fecha',
                                        'Hora'
                                    ],
                                    [
                                        { text: 'INGRESO', border: [false, false, false, false] },
                                        { text: 'fechaaa', border: [true, true, true, true] },
                                        { text: 'horaaa', border: [true, true, true, true] },
                                    ]
                                ]
                            },
                            layout: {
                                defaultBorder: false,
                            }
                        },
                        {
                            border: [false, false, true, true],
                            style: 'tableExample',
                            table: {
                                widths: [95, 70, 70],
                                body: [
                                    [
                                        '',
                                        'Fecha',
                                        'Hora'
                                    ],
                                    [
                                        { text: 'SALIDA', border: [false, false, false, false] },
                                        { text: 'fechaaa', border: [true, true, true, true] },
                                        { text: 'horaaa', border: [true, true, true, true] },
                                    ]
                                ]
                            },
                            layout: {
                                defaultBorder: false,
                            }
                        },

                    ]
                ]
            }
        })

    }
    console.log(iteraciones)
    const imagePath_Alcaldia: any = await getBase64ImageFromUrl('../../../assets/img/logo_alcaldia.png')
    let docDefinition: TDocumentDefinitions
    docDefinition = {
        pageSize: 'LETTER',
        pageMargins: [20, 5, 20, 20],
        content: [
            {
                columns: [
                    {
                        image: imagePath_Alcaldia,
                        width: 80,
                        height: 80,
                        alignment: 'left'
                    },
                    {
                        width: '*',
                        text: '\n\nHOJA DE RUTA DE CORRESPONDENCIA',
                        style: 'header',
                        alignment: 'center'

                    },
                    {
                        width: 90,
                        text: ` Impresion: ${moment(new Date()).format('DD-MM-YYYY HH:mm:ss')}`,
                        alignment: 'center',
                        fontSize: 10
                    },
                ]
            },
            {
                columns: [

                    {
                        width: 130,
                        style: 'tableExample',
                        table: {
                            widths: [100, 15],
                            body: [
                                [
                                    { text: 'CORRESPONDENCIA EXTERNA', border: [false, false, false, false] },
                                    ''
                                ]
                            ]
                        }

                    },
                    {
                        width: 130,
                        style: 'tableExample',
                        table: {
                            widths: [100, 15],
                            body: [
                                [
                                    { text: 'CORRESPONDENCIA INTERNA', border: [false, false, false, false] },
                                    ''
                                ]
                            ]
                        }

                    },
                    {
                        width: 80,
                        style: 'tableExample',
                        table: {
                            widths: [50, 15],
                            body: [
                                [
                                    { text: 'COPIA', border: [false, false, false, false] },
                                    'x'
                                ]
                            ]
                        }

                    },
                    {
                        width: '*',
                        style: 'tableExample',
                        table: {
                            widths: [100, 100],
                            body: [
                                [
                                    { text: 'NRO UNICO DE CORRESPONDENCIA', border: [false, false, false, false] },
                                    'APR-EEE--SDS'
                                ]
                            ]
                        }
                    },
                ]
            },
            {
                columns: [
                    {
                        width: 120,
                        text: ''
                    },
                    {
                        style: 'tableExample',
                        table: {
                            widths: [100, 70, 70],
                            body: [
                                [
                                    '',
                                    'Fecha',
                                    'Hora'
                                ],
                                [
                                    { text: 'EMISION / RECEPCION', border: [false, false, false, false] },
                                    { text: 'fechaaa', border: [true, true, true, true] },
                                    { text: 'horaaa', border: [true, true, true, true] },
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
            {
                fontSize: 10,
                table: {
                    widths: ['*'],
                    body: [
                        [

                            {
                                border: [true, true, true, false],
                                lineHeight: 1.4,
                                columns: [
                                    [
                                        {
                                            columns: [
                                                { width: 80, text: 'CITE' },
                                                { text: 'Underline decoration', decoration: 'underline' }
                                            ]
                                        },
                                        {
                                            columns: [
                                                { text: 'REMITENTE', width: 80 },
                                                { text: 'Underline decoration', decoration: 'underline' },
                                            ]
                                        },
                                        {
                                            columns: [
                                                { text: 'DESTINATARIO', width: 80 },
                                                { text: 'Underline decoration', decoration: 'underline' },
                                            ]
                                        },
                                        {
                                            columns: [
                                                { text: 'REFERENCIA', width: 80 },
                                                { text: 'Underline decoration', decoration: 'underline' },
                                            ]
                                        },
                                    ],
                                    [
                                        {
                                            table: {
                                                widths: [200, 60],
                                                body: [
                                                    [
                                                        { text: 'NRO. REGISTRO INTERNO (Correlativo)', border: [false, false, false, false] },
                                                        { text: 'fechaaa' },
                                                    ]
                                                ]
                                            },
                                        },
                                        {
                                            columns: [
                                                { text: 'CARGO', width: 80 },
                                                { text: 'Underline decoration', decoration: 'underline' },
                                            ]
                                        },
                                        {
                                            columns: [
                                                { text: 'CARGO', width: 80 },
                                                { text: 'Underline decoration', decoration: 'underline' },
                                            ]
                                        },

                                    ]
                                ]
                            }

                        ],
                        [
                            {
                                border: [true, false, true, true],
                                columns: [
                                    {
                                        width: 120,
                                        text: ''
                                    },
                                    {
                                        style: 'tableExample',
                                        table: {
                                            widths: [100, 70, 70],
                                            body: [
                                                [
                                                    '',
                                                    'Fecha',
                                                    'Hora'
                                                ],
                                                [
                                                    { text: 'SALIDA', border: [false, false, false, false] },
                                                    { text: 'fechaaa', border: [true, true, true, true] },
                                                    { text: 'horaaa', border: [true, true, true, true] },
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
                        ]
                    ]
                }


            },
            iteraciones
            // {
            //     fontSize: 10,
            //     table: {
            //         widths: ['*', '*'],
            //         body: [
            //             [{ text: 'DESTINATARIO:', colSpan: 2, alignment: 'left', border: [false, false, false, false] }, ''],
            //             [
            //                 {
            //                     border: [true, true, false, false],
            //                     table: {
            //                         heights: [80],
            //                         body: [
            //                             [
            //                                 {

            //                                     table: {
            //                                         heights: 80,
            //                                         widths: [80],
            //                                         body: [
            //                                             ['']
            //                                         ]
            //                                     },
            //                                 },
            //                                 [
            //                                     { text: 'Intruccion proveido' },
            //                                     { text: 'ingresar' },
            //                                 ]
            //                             ]
            //                         ]
            //                     },
            //                     layout: {
            //                         defaultBorder: false,
            //                     }
            //                 },
            //                 {
            //                     rowSpan: 1,
            //                     border: [false, true, true, false],
            //                     table: {
            //                         widths: [180, 60],
            //                         body: [
            //                             [
            //                                 { text: 'NRO. REGISTRO INTERNO (Correlativo)', border: [false, false, false, false] },
            //                                 { text: 'fechaaa' }
            //                             ],
            //                             [
            //                                 { text: '\n\n\n\n-----------------------------------------', colSpan: 2, border: [false, false, false, false], alignment: 'center' }
            //                             ],
            //                             [
            //                                 { text: 'Firm y sello', colSpan: 2, border: [false, false, false, false], alignment: 'center' }

            //                             ]
            //                         ]
            //                     }
            //                 },
            //             ],
            //             [
            //                 {
            //                     border: [true, false, false, true],
            //                     style: 'tableExample',
            //                     table: {
            //                         widths: [95, 70, 70],
            //                         body: [
            //                             [
            //                                 '',
            //                                 'Fecha',
            //                                 'Hora'
            //                             ],
            //                             [
            //                                 { text: 'INGRESO', border: [false, false, false, false] },
            //                                 { text: 'fechaaa', border: [true, true, true, true] },
            //                                 { text: 'horaaa', border: [true, true, true, true] },
            //                             ]
            //                         ]
            //                     },
            //                     layout: {
            //                         defaultBorder: false,
            //                     }
            //                 },
            //                 {
            //                     border: [false, false, true, true],
            //                     style: 'tableExample',
            //                     table: {
            //                         widths: [95, 70, 70],
            //                         body: [
            //                             [
            //                                 '',
            //                                 'Fecha',
            //                                 'Hora'
            //                             ],
            //                             [
            //                                 { text: 'SALIDA', border: [false, false, false, false] },
            //                                 { text: 'fechaaa', border: [true, true, true, true] },
            //                                 { text: 'horaaa', border: [true, true, true, true] },
            //                             ]
            //                         ]
            //                     },
            //                     layout: {
            //                         defaultBorder: false,
            //                     }
            //                 },

            //             ]
            //         ]
            //     }
            // },



        ],
        styles: {
            header: {
                fontSize: 12,
                bold: true,
                alignment: 'justify'
            },
            tableExample: {
                fontSize: 8,
                alignment: 'center',
                margin: [0, 0, 0, 10]
            },

        }
    };



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