import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, ContentTable, TDocumentDefinitions, Table, TableCell } from "pdfmake/interfaces";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as moment from "moment-timezone";
moment.tz.setDefault("America/La_Paz")
import { Externo } from "../../Tramites/models/Externo.interface";
import { WorkflowData } from "src/app/Bandejas/models/workflow.interface";
const ordinales = require("ordinales-js");

interface RoadMap {
    remitente: {
        nombre_completo: string
        cargo: string
    }
    proveido: string
    sends: {
        destinatario: {
            nombre_completo: string
            cargo: string
        }
        entrada: [string, string, string, string]
        salida: [string, string, string, string]
    }[]
}
export const TestRoute = async (tramite: Externo, workflow: WorkflowData[]) => {
    const logo: any = await getBase64ImageFromUrl('../../../assets/img/logo_alcaldia2.jpeg')
    let docDefinition: TDocumentDefinitions
    const solicitante: string = tramite.solicitante.tipo === 'NATURAL' ? `${tramite.solicitante.nombre} ${tramite.solicitante.paterno} ${tramite.solicitante.materno}` : `${tramite.solicitante.nombre}`
    let firstContainerData: { destinatario: { nombre_completo: string, cargo: string }, proveido: string, numero_interno: string } = {
        destinatario: { nombre_completo: '', cargo: '' },
        numero_interno: '',
        proveido: ''
    }
    workflow = workflow.filter(element => element.recibido === true || element.recibido === undefined)
    const roadMap = createRoadMapData(workflow)
    if (roadMap.length > 0) {
        firstContainerData = {
            destinatario: { nombre_completo: createFullName(workflow[0].emisor.funcionario), cargo: workflow[0].emisor.funcionario.cargo },
            numero_interno: workflow[0].numero_interno,
            proveido: roadMap[0].proveido
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
                                        [`${tramite.cite !== '' ? `CITE: ${tramite.cite}  |  ` : ''}TEL.: ${tramite.solicitante.telefono}`,
                                        {
                                            table: {
                                                widths: [85, 100, 40],
                                                body: [
                                                    [
                                                        { text: '', border: [false, false, false, false] },
                                                        { text: 'NRO. REGISTRO INTERNO (Correlativo)', border: [false, false, false, false] },
                                                        { text: `${firstContainerData.numero_interno}`, fontSize: 9, alignment: 'center' },
                                                    ]
                                                ]
                                            },
                                        },
                                        ],
                                        [`REMITENTE: ${solicitante}`, `CARGO: P. ${tramite.solicitante.tipo}`],
                                        [`DESTINATARIO: ${firstContainerData.destinatario.nombre_completo}`, `CARGO:${firstContainerData.destinatario.cargo}`],
                                        [{ text: `REFERENCIA: ${firstContainerData.proveido}`, colSpan: 2 }]
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
            createContainers(roadMap),
            {
                table: {
                    widths: ['*'],
                    body: [
                        [{ text: `SEGUNDA PARTE`, fontSize: 7, bold: true, alignment: 'left', border: [true, false, true, true] }]
                    ]
                }
            }
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

function createContainers(data: RoadMap[]) {
    const cuadros: ContentTable[] = []
    for (let index = 0; index < data.length; index++) {
        const sectionDates: TableCell[][] = []
        let sectionNumbers: TableCell[][] = []
        let destinatarios = ''
        data[index].sends.forEach(element => {
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
                    { text: 'INGRESO', border: [false, false, false, false], fontSize: 7 },
                    { text: `${element.entrada[0]}`, fontSize: 8, border: [true, true, true, true] },
                    { text: `${element.entrada[1]}`, fontSize: 8, border: [true, true, true, true] },
                    { text: `${element.entrada[2]}`, fontSize: 6, border: [true, true, true, true] },
                    { text: 'SALIDA', border: [false, false, false, false], fontSize: 7 },
                    { text: `${element.salida[0]}`, border: [true, true, true, true], fontSize: 8 },
                    { text: `${element.salida[1]}`, border: [true, true, true, true], fontSize: 8 },
                    { text: `${element.salida[2]}`, border: [true, true, true, true], fontSize: 6 }
                ]
            )
            sectionNumbers.push(
                [
                    { text: 'NRO. REGISTRO INTERNO (Correlativo)', border: [false, false, false, false] },
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
                                                { text: `${data[index].proveido}`, bold: true },
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
                        ],

                        // [{ text: `SEGUNDA PARTE`, colSpan: 2, fontSize: 7, bold: true, alignment: 'left', border: [true, false, true, true] }, '']

                    ]
                }
            }
        )
        if (data[index].sends.length > 1) {
            cuadros[index].table.body.unshift(
                [{ margin: [0, 0, 0, 0], text: `REMITENTE ${ordinales.toOrdinal(index + 1)}: ${data[index].remitente.nombre_completo} - CARGO:${data[index].remitente.cargo}`.toUpperCase(), colSpan: 2, alignment: 'left', border: [true, false, true, false] }, '']
            )
        }
    }
    return cuadros
}

function createRoadMapData(workflow: WorkflowData[]): RoadMap[] {
    const merged = workflow.reduce((r: any, { tramite, emisor, fecha_envio, motivo, numero_interno, cantidad, ...rest }, index) => {
        const key = `${tramite}-${emisor.cuenta._id}-${fecha_envio}`;
        r[key] = r[key] || { remitente: { nombre_completo: createFullName(emisor.funcionario), cargo: emisor.funcionario.cargo }, proveido: motivo, sends: [] };
        let salida: [string, string, string, string] = ['', '', '', '']
        for (let j = index; j < workflow.length; j++) {
            if (rest.receptor.cuenta._id === workflow[j].emisor.cuenta._id) {
                salida = [moment(new Date(workflow[j].fecha_envio)).format('DD-MM-YYYY'), moment(new Date(workflow[j].fecha_envio)).format('HH:mm A'), workflow[j].cantidad, workflow[j].numero_interno]
                break
            }
        }
        r[key]["sends"].push({ destinatario: { nombre_completo: createFullName(rest.receptor.funcionario), cargo: rest.receptor.funcionario.cargo }, entrada: rest.fecha_recibido ? [moment(rest.fecha_recibido).format('DD-MM-YYYY'), moment(rest.fecha_recibido).format('HH:mm A'), cantidad, numero_interno] : ['', '', '', ''], salida })
        return r;
    }, {})
    return Object.values(merged)
}
function createFullName(account: { nombre: string, paterno: string, materno: string }): string {
    return `${account.nombre} ${account.paterno} ${account.materno}`
}
