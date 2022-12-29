import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from "pdfmake/interfaces";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';


export const crear_ficha_tramite = async (tipo_tramite: string, fecha_registro: string, alterno: string, pin: number, nombre: string, paterno: string, materno: string, dni: string, documento: string, tipo: 'NATURAL' | 'JURIDICO') => {
    const imagePath_Alcaldia: any = await getBase64ImageFromUrl('../../../assets/img/logo_alcaldia.png')
    let dataSolicitante: any
    let docDefinition: TDocumentDefinitions
    if (tipo === 'NATURAL') {
        dataSolicitante = {
            text: `Solicitante: ${nombre} ${paterno} ${materno} / ${documento} - ${dni}\n\n`,
            alignment: 'center'
        }
    }
    else {
        dataSolicitante = {
            text: `Solicitante: ${nombre}\n\n`,
            alignment: 'center'
        }
    }
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
            dataSolicitante

        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: 'justify'
            }
        }
    };
    pdfMake.createPdf(docDefinition).print();
}


export const crear_hoja_ruta = async (tramite: any, workflow: any[], tipo: 'tramites_externos' | 'tramites_internos' | 'copia') => {
    workflow = workflow.filter(flujo => flujo.recibido === true)
    const imagePath_Alcaldia: any = await getBase64ImageFromUrl('../../../assets/img/logo_alcaldia.png')
    let docDefinition: TDocumentDefinitions
    let check_interno, check_externo
    let primer_recuadro
    let interaciones = []
    let fecha_salida = []
    let hojas = 0
    let destinatario
    let cantidad
    let numero_interno, primer_numero_envio
    let nombre_solicitante
    switch (tipo) {
        case 'tramites_externos':
            check_externo = "X"
            check_interno = ""
            break;
        case 'tramites_internos':
            check_externo = ""
            check_interno = "X"
            break;
    }
    switch (tramite.solicitante.tipo) {
        case 'NATURAL':
            nombre_solicitante = `${tramite.solicitante.nombre} ${tramite.solicitante.paterno} ${tramite.solicitante.materno}`
            break;
        case 'JURIDICO':
            nombre_solicitante = tramite.solicitante.nombre
            break;
    }
    if (workflow.length > 0) {
        primer_recuadro = [
            { text: 'SALIDA', border: [false, false, false, false] },
            { text: `${moment(workflow[0].fecha_envio).format('DD-MM-YYYY')}`, border: [true, true, true, true] },
            { text: `${moment(workflow[0].fecha_envio).format('HH:mm:ss')}`, border: [true, true, true, true] },
            { text: `${workflow[0].cantidad}`, border: [true, true, true, true] }
        ]
        hojas = 7
        destinatario = { nombre: workflow[0].receptor.funcionario, cargo: workflow[0].receptor.cargo }
        primer_numero_envio = workflow[0].numero_interno
    }
    else {
        primer_recuadro = [
            { text: 'SALIDA', border: [false, false, false, false] },
            { text: '', border: [true, true, true, true] },
            { text: '', border: [true, true, true, true] },
            { text: ``, border: [true, true, true, true] }
        ]
        hojas = 7
        destinatario = { nombre: '.............................', cargo: '.............................' }
        primer_numero_envio = ""
    }

    for (let index = 0; index < workflow.length; index++) {
        if (workflow[index + 1]) {
            fecha_salida[0] = moment(new Date(workflow[index + 1].fecha_envio)).format('DD-MM-YYYY')
            fecha_salida[1] = moment(new Date(workflow[index + 1].fecha_envio)).format('HH:mm:ss')
            cantidad = workflow[index + 1].cantidad
            numero_interno = workflow[index + 1].numero_interno
        }
        else {
            fecha_salida[0] = ""
            fecha_salida[1] = ""
            cantidad = ""
            numero_interno = ""
        }
        interaciones.push(
            {
                dontBreakRows: true,
                fontSize: 9,
                table: {
                    dontBreakRows: true,
                    widths: ['*', '*'],
                    body: [
                        [{ text: `\nDESTINATARIO ${index + 1}: ${workflow[index].receptor.funcionario} (${workflow[index].receptor.cargo})`, colSpan: 2, alignment: 'left', border: [false, false, false, false] }, ''],
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
                                                { text: 'Intruccion / Proveido' },
                                                { text: `${workflow[index].motivo}`, alignment: 'left', style: 'header' }
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
                                    widths: [160, 80],
                                    body: [
                                        [
                                            { text: 'NRO. REGISTRO INTERNO (Correlativo)', border: [false, false, false, false] },
                                            { text: `${numero_interno}` }
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
                                    widths: [40, 60, 60, 60],
                                    body: [
                                        [
                                            '',
                                            'Fecha',
                                            'Hora',
                                            'Cantidad'
                                        ],
                                        [
                                            { text: 'INGRESO', border: [false, false, false, false] },
                                            { text: `${moment(new Date(workflow[index].fecha_recibido)).format('DD-MM-YYYY')}`, border: [true, true, true, true] },
                                            { text: `${moment(new Date(workflow[index].fecha_recibido)).format('HH:mm:ss')}`, border: [true, true, true, true] },
                                            { text: `${workflow[index].cantidad}`, border: [true, true, true, true] },
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
                                    widths: [40, 60, 60, 60],
                                    body: [
                                        [
                                            '',
                                            'Fecha',
                                            'Hora',
                                            'Cantidad'
                                        ],
                                        [
                                            { text: 'SALIDA', border: [false, false, false, false] },
                                            { text: `${fecha_salida[0]}`, border: [true, true, true, true] },
                                            { text: `${fecha_salida[1]}`, border: [true, true, true, true] },
                                            { text: `${cantidad}`, border: [true, true, true, true] },
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
            }
        )
    }
    for (let index = workflow.length; index < hojas; index++) {
        interaciones.push(
            {
                dontBreakRows: true,
                fontSize: 9,
                table: {
                    dontBreakRows: true,
                    widths: ['*', '*'],
                    body: [
                        [{ text: `\n\nDESTINATARIO ${index + 1}:`, colSpan: 2, alignment: 'left', border: [false, false, false, false] }, ''],
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
                                                { text: `` },
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
                                            { text: '' }
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
                                    widths: [40, 60, 60, 60],
                                    body: [
                                        [
                                            '',
                                            'Fecha',
                                            'Hora',
                                            'Cantidad'
                                        ],
                                        [
                                            { text: 'INGRESO', border: [false, false, false, false] },
                                            { text: ``, border: [true, true, true, true] },
                                            { text: ``, border: [true, true, true, true] },
                                            { text: ``, border: [true, true, true, true] }
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
                                    widths: [40, 60, 60, 60],
                                    body: [
                                        [
                                            '',
                                            'Fecha',
                                            'Hora',
                                            'Cantidad'
                                        ],
                                        [
                                            { text: 'SALIDA', border: [false, false, false, false] },
                                            { text: ``, border: [true, true, true, true] },
                                            { text: ``, border: [true, true, true, true] },
                                            { text: ``, border: [true, true, true, true] }
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
            }

        )
    }
    docDefinition = {
        pageSize: 'LETTER',
        pageMargins: [30, 30, 30, 30],
        content: [
            {
                absolutePosition: { x: 440, y: 30 },
                width: 90,
                text: ` Impresion: ${moment(new Date()).format('DD-MM-YYYY HH:mm:ss')}\n`,
                alignment: 'left',
                fontSize: 10
            },
            {
                image: imagePath_Alcaldia,
                width: 80,
                height: 75,
                alignment: 'left',
                absolutePosition: { x: 10, y: 10 }
            },
            {

                text: 'HOJA DE RUTA DE CORRESPONDENCIA\n\n',
                bold: true,
                alignment: 'center'
            },
            // TICKEO TIPO DE HOJA DE RUTA
            {
                columns: [
                    {
                        width: 40,
                        text: ''

                    },

                    {
                        width: 100,
                        style: 'tableExample',
                        fontSize: 8,
                        table: {
                            widths: [75, 5],
                            body: [
                                [
                                    { text: 'CORRESPONDENCIA EXTERNA', border: [false, false, false, false] },
                                    { text: check_externo, style: 'header' }
                                ]
                            ]
                        }

                    },
                    {
                        width: 100,
                        style: 'tableExample',
                        table: {
                            widths: [75, 5],
                            body: [
                                [
                                    { text: 'CORRESPONDENCIA INTERNA', border: [false, false, false, false] },
                                    { text: check_interno, style: 'header' }
                                ]
                            ]
                        }

                    },
                    {
                        width: 50,
                        style: 'tableExample',
                        table: {
                            widths: [30, 5],
                            body: [
                                [
                                    { text: 'COPIA', border: [false, false, false, false] },
                                    { text: "", style: 'header' }
                                ]
                            ]
                        }

                    },
                    {
                        width: '*',
                        style: 'tableExample',
                        table: {
                            widths: [100, '*'],
                            body: [
                                [
                                    { text: 'NRO. UNICO DE CORRESPONDENCIA', border: [false, false, false, false] },
                                    { text: `${tramite.alterno}`, style: 'header' }
                                ]
                            ]
                        }
                    },
                ]
            },
            // EMISION RECEPCION
            {
                columns: [
                    {
                        width: 100,
                        text: ''
                    },
                    {
                        style: 'tableExample',

                        table: {
                            widths: [100, 70, 70, 70],
                            body: [
                                [
                                    '',
                                    'Fecha',
                                    'Hora',
                                    'Cantidad'
                                ],
                                [
                                    { text: 'EMISION / RECEPCION', border: [false, false, false, false] },
                                    { text: `${moment(new Date(tramite.fecha_registro)).format('DD-MM-YYYY')}`, border: [true, true, true, true] },
                                    { text: `${moment(new Date(tramite.fecha_registro)).format('HH:mm:ss')}`, border: [true, true, true, true] },
                                    { text: `${tramite.cantidad}`, border: [true, true, true, true] },
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
            // // PRIMER RECUADRO
            {
                fontSize: 9,
                table: {
                    widths: ['*'],
                    body: [
                        [
                            {
                                border: [true, true, true, false],

                                table: {
                                    widths: ['*', '*'],
                                    body: [
                                        [`CITE: ${tramite.cite ? tramite.cite : ''}  /   TEL.: ${tramite.solicitante.telefono}`,
                                        {
                                            table: {
                                                widths: [160, 80],
                                                body: [
                                                    [
                                                        { text: 'NRO. REGISTRO INTERNO (Correlativo)', border: [false, false, false, false] },
                                                        { text: primer_numero_envio },
                                                    ]
                                                ]
                                            },
                                        },
                                        ],
                                        [`REMITENTE: ${nombre_solicitante}`, `REMITENTE: P. ${tramite.solicitante.tipo}`],
                                        [`DESTINATARIO: ${destinatario.nombre}`, `CARGO: ${destinatario.cargo}`],
                                        [{ text: `REFERENCIA: ${tramite.detalle}`, colSpan: 2 }]
                                    ]
                                },
                                layout: 'noBorders'
                            }

                        ],
                        [
                            {
                                border: [true, false, true, true],
                                columns: [
                                    {
                                        width: 100,
                                        text: ''
                                    },
                                    {
                                        style: 'tableExample',
                                        table: {
                                            widths: [95, 70, 70, 70],
                                            body: [
                                                [
                                                    '',
                                                    'Fecha',
                                                    'Hora',
                                                    'Hojas'
                                                ],
                                                primer_recuadro
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
            interaciones
        ],
        styles: {
            header: {
                fontSize: 10,
                bold: true,
            },
            tableExample: {
                fontSize: 8,
                alignment: 'center',
                margin: [0, 0, 0, 5]
            }
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