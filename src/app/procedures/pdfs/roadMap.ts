import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, ContentTable, TDocumentDefinitions, Table, TableCell } from "pdfmake/interfaces";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as moment from "moment-timezone";
moment.tz.setDefault("America/La_Paz")
import { Externo } from "../models/Externo.interface";
import { WorkflowData } from "src/app/Bandejas/models/workflow.interface";
import { Interno } from "../models/Interno.interface";
const ordinales = require("ordinales-js");

interface RoadMap {
    remitente: {
        nombre_completo: string
        cargo: string
    }
    motivo: string
    sends: {
        destinatario: {
            nombre_completo: string
            cargo: string
        }
        entrada: [string, string, string]
        salida: [string, string, string, string, string]
    }[]
}
export async function externalRouteMap(procedure: Externo, workflow: WorkflowData[]) {
    const logo1 = await getBase64ImageFromUrl('../../../assets/img/logo_alcaldia2.jpeg')
    const logo2 = await getBase64ImageFromUrl('../../../assets/img/logo_sacaba.jpeg')
    workflow = workflow.filter(element => element.recibido !== false)
    let content: Content[] = []
    if (workflow.length > 0) {
        const data = createRoadMapData(workflow)
        content = [
            createTitleSheet(logo1, logo2),
            createFirstContainerExternal(
                procedure,
                [{ nombre_completo: createFullName(workflow[0].receptor.funcionario), cargo: workflow[0].receptor.funcionario.cargo }],
                [
                    moment(workflow[0].fecha_envio).format('DD-MM-YYYY'),
                    moment(workflow[0].fecha_envio).format('HH:mm A'),
                    workflow[0].cantidad,
                    workflow[0].numero_interno
                ]
            ),
            createAprovedRouteMap(data),
            createWhiteContainers(data.length + 1, 8)
        ]
    }
    else {
        content = [
            createTitleSheet(logo1, logo2),
            createFirstContainerExternal(
                procedure,
                [{ nombre_completo: '', cargo: '' }],
                ['', '', '', '']
            ),
            createWhiteContainers(1, 8)
        ]
    }
    createRouteMap(content)
}
export async function internalRouteMap(procedure: Interno, workflow: WorkflowData[]) {
    const logo1 = await getBase64ImageFromUrl('../../../assets/img/logo_alcaldia2.jpeg')
    const logo2 = await getBase64ImageFromUrl('../../../assets/img/logo_sacaba.jpeg')
    workflow = workflow.filter(element => element.recibido !== false)
    let content: Content[] = []
    if (workflow.length > 0) {
        const data = createRoadMapData(workflow)
        content = [
            createTitleSheet(logo1, logo2),
            createFirstContainerInternal(
                procedure,
                [
                    moment(workflow[0].fecha_envio).format('DD-MM-YYYY'),
                    moment(workflow[0].fecha_envio).format('HH:mm A'),
                    workflow[0].cantidad,
                    workflow[0].numero_interno
                ]
            ),
            createAprovedRouteMap(data),
            createWhiteContainers(data.length + 1, 8)
        ]
    }
    else {
        content = [
            createTitleSheet(logo1, logo2),
            createFirstContainerInternal(
                procedure,
                ['', '', '', '']
            ),
            createWhiteContainers(1, 8)
        ]
    }
    createRouteMap(content)
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


const getBase64ImageFromUrl = async (imageUrl: string): Promise<any> => {
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
const createTitleSheet = (logo1: string, logo2: string): Content => {
    return [{
        style: 'cabecera',
        columns: [
            {
                image: logo1,
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
                image: logo2,
                width: 70,
                height: 70,
            },
        ]
    }]
}
function createContainers(data: RoadMap[]) {
    let multiple = false
    if (data.some(element => element.sends.length > 1)) multiple = true
    const cuadros: ContentTable[] = []
    for (let index = 0; index < data.length; index++) {
        const sectionDates: TableCell[][] = []
        let sectionNumbers: TableCell[][] = []
        let destinatarios = ''
        data[index].sends.forEach((element, index) => {
            destinatarios = destinatarios + ` ${multiple ? index + 1 + ')' : ''} ${element.destinatario.nombre_completo} (${element.destinatario.cargo}) `
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
                    { text: `${element.entrada[0]}`, fontSize: 8, border: [true, true, true, true] },
                    { text: `${element.entrada[1]}`, fontSize: 8, border: [true, true, true, true] },
                    { text: `${element.entrada[2]}`, fontSize: 6, border: [true, true, true, true] },
                    { text: `SALIDA`, border: [false, false, false, false], fontSize: 7 },
                    { text: `${element.salida[0]}`, border: [true, true, true, true], fontSize: 8 },
                    { text: `${element.salida[1]}`, border: [true, true, true, true], fontSize: 8 },
                    { text: `${element.salida[2]}`, border: [true, true, true, true], fontSize: 6 }
                ]
            )
            sectionNumbers.push(
                [
                    { text: `NRO. REGISTRO INTERNO (Correlativo)`, border: [false, false, false, false] },
                    { text: `${element.salida[3]}` }
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
                        [{ margin: [0, 0, 0, 0], text: `DESTINATARIO ${ordinales.toOrdinal(index + 1)}: ${destinatarios}`.toUpperCase(), colSpan: 2, alignment: 'left', border: [true, false, true, false] }, ''],
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
                                                { text: `\n\n${data[index].motivo}`, bold: true, alignment: 'center' }
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
        if (multiple === true) {
            cuadros[index].table.body.unshift(
                [{ margin: [0, 0, 0, 0], text: `REMITENTE: ${data[index].remitente.nombre_completo} - CARGO:${data[index].remitente.cargo}`.toUpperCase(), colSpan: 2, alignment: 'left', border: [true, false, true, false] }, '']
            )
        }
        if (index === 0) {
            cuadros[index].table.body.push([{ text: `SEGUNDA PARTE`, fontSize: 7, bold: true, alignment: 'left', border: [true, false, true, true], colSpan: 2 }, ''])
        }
    }
    return cuadros
}
function createAprovedRouteMap(data: RoadMap[]) {
    const divider = data.findIndex(element => element.sends.length > 1)
    const firstPart = divider > -1 ? data.slice(0, divider) : data
    const secondPart = divider > -1 ? data[divider] : undefined
    const cuadros: ContentTable[] = []
    for (let index = 0; index < firstPart.length; index++) {
        const sectionDates: TableCell[][] = []
        let sectionNumbers: TableCell[][] = []
        let destinatarios = ''
        data[index].sends.forEach((element) => {
            destinatarios = destinatarios + `${element.destinatario.nombre_completo} (${element.destinatario.cargo}) // `
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
                    { text: `${element.entrada[0]}`, fontSize: 8, border: [true, true, true, true] },
                    { text: `${element.entrada[1]}`, fontSize: 8, border: [true, true, true, true] },
                    { text: `${element.entrada[2]}`, fontSize: 6, border: [true, true, true, true] },
                    { text: `SALIDA`, border: [false, false, false, false], fontSize: 7 },
                    { text: `${element.salida[0]}`, border: [true, true, true, true], fontSize: 8 },
                    { text: `${element.salida[1]}`, border: [true, true, true, true], fontSize: 8 },
                    { text: `${element.salida[2]}`, border: [true, true, true, true], fontSize: 6 }
                ]
            )
            sectionNumbers.push(
                [
                    { text: `NRO. REGISTRO INTERNO (Correlativo)`, border: [false, false, false, false] },
                    { text: `${element.salida[3]}` }
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
                        [{ margin: [0, 0, 0, 0], text: `DESTINATARIO ${ordinales.toOrdinal(index + 1)} (NOMBRE Y CARGO): ${destinatarios}`.toUpperCase(), colSpan: 2, alignment: 'left', border: [true, false, true, false] }, ''],
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
                                                { text: `\n\n${data[index].motivo}`, bold: true, alignment: 'center' }
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
        if (index === 0) {
            cuadros[index].table.body.push([{ text: `SEGUNDA PARTE`, fontSize: 7, bold: true, alignment: 'left', border: [true, false, true, true], colSpan: 2 }, ''])
        }
    }
    if (secondPart) {
        const destinatarios = secondPart.sends.map(send => `${send.destinatario.nombre_completo} (${send.destinatario.cargo})`).join(' // ')
        cuadros.push(
            {
                fontSize: 7,
                unbreakable: true,
                table: {
                    dontBreakRows: true,
                    widths: [360, '*'],
                    body: [
                        [{ margin: [0, 0, 0, 0], text: `DESTINATARIO ${ordinales.toOrdinal(divider > 0 ? divider : 1)} (NOMBRE Y CARGO): ${destinatarios}`.toUpperCase(), colSpan: 2, alignment: 'left', border: [true, false, true, false] }, ''],
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
                                                { text: ``, bold: true, alignment: 'center' }
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
                                            { text: `NRO. REGISTRO INTERNO (Correlativo)`, border: [false, false, false, false] },
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
                                            { text: `INGRESO`, border: [false, false, false, false], fontSize: 7 },
                                            { text: ``, fontSize: 8, border: [true, true, true, true] },
                                            { text: ``, fontSize: 8, border: [true, true, true, true] },
                                            { text: ``, fontSize: 6, border: [true, true, true, true] },
                                            { text: `SALIDA`, border: [false, false, false, false], fontSize: 7 },
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
                        ]
                    ]
                }
            }
        )
    }
    return cuadros
}
function createFirstContainerExternal(tramite: Externo, destinatarios: { nombre_completo: string, cargo: string }[], salida: [string, string, string, string]): ContentTable {
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
                                            { text: `${tramite.alterno}`, bold: true, fontSize: 11 }
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
                                            { text: `${moment(tramite.fecha_registro).format('DD-MM-YYYY')}`, fontSize: 8, border: [true, true, true, true] },
                                            { text: `${moment(tramite.fecha_registro).format('HH:mm A')}`, fontSize: 8, border: [true, true, true, true] },
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
                                [`${tramite.cite !== '' ? `CITE: ${tramite.cite}  |  ` : ''} TEL.: ${tramite.solicitante.telefono}`,
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
                                [`REMITENTE: ${tramite.solicitante.tipo === 'NATURAL' ? createFullName(tramite.solicitante) : tramite.solicitante.nombre}`, `CARGO: P. ${tramite.solicitante.tipo}`],
                                ...sectionReceiver,
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
function createFirstContainerInternal(tramite: Interno, salida: [string, string, string, string]): ContentTable {
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
                                            { text: 'X', style: 'header' }
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
                                            { text: '', style: 'header' }
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
                                            { text: `${tramite.alterno}`, bold: true, fontSize: 11 }
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
                                            { text: `${moment(tramite.fecha_registro).format('DD-MM-YYYY')}`, fontSize: 8, border: [true, true, true, true] },
                                            { text: `${moment(tramite.fecha_registro).format('HH:mm A')}`, fontSize: 8, border: [true, true, true, true] },
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
                                [`${tramite.cite !== '' ? `CITE: ${tramite.cite}` : 'CITE: S/C'}}`,
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
                                [`REMITENTE: ${tramite.remitente.nombre}`, `CARGO: P. ${tramite.remitente.cargo}`],
                                [`DESTINATARIO: ${tramite.destinatario.nombre}`, `CARGO: P. ${tramite.destinatario.cargo}`],
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

function createWhiteContainers(initRange: number, endRange: number) {
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

function createRoadMapData(workflow: WorkflowData[]): RoadMap[] {
    const merged = workflow.reduce((r: any, { tramite, emisor, fecha_envio, motivo, numero_interno, cantidad, ...rest }, index) => {
        const key = `${tramite}-${emisor.cuenta._id}-${fecha_envio}`;
        r[key] = r[key] || { remitente: { nombre_completo: createFullName(emisor.funcionario), cargo: emisor.funcionario.cargo }, motivo, sends: [] };
        let salida: [string, string, string, string] = ['', '', '', '']
        for (let j = index; j < workflow.length; j++) {
            if (rest.receptor.cuenta._id === workflow[j].emisor.cuenta._id) {
                salida = [moment(workflow[j].fecha_envio).format('DD-MM-YYYY'), moment(workflow[j].fecha_envio).format('HH:mm A'), workflow[j].cantidad, workflow[j].numero_interno]
                break
            }
        }
        r[key]["sends"].push({ destinatario: { nombre_completo: createFullName(rest.receptor.funcionario), cargo: rest.receptor.funcionario.cargo }, entrada: rest.fecha_recibido ? [moment(rest.fecha_recibido).format('DD-MM-YYYY'), moment(rest.fecha_recibido).format('HH:mm A'), cantidad] : ['', '', ''], salida })
        return r;
    }, {})
    return Object.values(merged)
}
export function filtreMyData(workflow: WorkflowData[], id_account: string) {
    const indexFound = workflow.map(el => el.receptor.cuenta._id).lastIndexOf(id_account)
    let newData = []
    let root = workflow[indexFound].receptor.cuenta._id
    for (let i = indexFound; i + 1 > 0; i--) {
        if (workflow[i].receptor.cuenta._id === root) {
            newData.unshift(workflow[i])
            root = workflow[i].emisor.cuenta._id
        }
    }
    return newData
}
function createFullName(person: { nombre: string, paterno: string, materno: string }): string {
    return [person.nombre, person.paterno, person.paterno].filter(Boolean).join(" ");
}
