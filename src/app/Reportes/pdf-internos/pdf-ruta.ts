import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from "pdfmake/interfaces";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import { getBase64ImageFromUrl } from "src/assets/pdf-img/image-base64";

export async function HojaRutaInternaDetalles(tramite: any, workflow: any[], funcionario: string) {
    const logo: any = await getBase64ImageFromUrl('../../../assets/img/logo_alcaldia2.jpeg')
    const logo2: any = await getBase64ImageFromUrl('../../../assets/img/sigamos_adelante.jpg')
    let fecha_generacion = moment(new Date()).format('DD-MM-YYYY HH:mm:ss')
    let docDefinition: TDocumentDefinitions
    let dataWorkflow: any[] = [
        [{ text: 'Remitente', style: 'tableHeader' }, { text: 'Destinatario', style: 'tableHeader' }, { text: 'Ingreso', style: 'tableHeader' }, { text: 'Salida', style: 'tableHeader' }, { text: 'Proveido', style: 'tableHeader' }]
    ]
    let destinatario
    if (workflow.length > 0) {
        destinatario = `${workflow[0].receptor.funcionario} - ${workflow[0].receptor.cargo}`
        workflow.forEach(element => {
            dataWorkflow.push(
                [
                    [
                        { text: `${element.emisor.funcionario} \n` },
                        { text: `${element.emisor.cargo}` },
                        { text: `Resp. ${element.emisor.cuenta.login}` }
                    ],
                    [
                        { text: `${element.receptor.funcionario}` },
                        { text: `${element.receptor.cargo}` },
                        { text: `Resp. ${element.receptor.cuenta.login}` }
                    ],
                    [
                        { text: `Nro. Reg. Interno ${element.numero_interno}` },
                        { text: `${moment(element.fecha_envio).format('DD-MM-YYYY')}` },
                        { text: `${moment(element.fecha_envio).format('HH:mm:ss')}` },
                        { text: `Cantidad: ${element.cantidad}` }
                    ],
                    [
                        { text: `Fecha ${moment(element.fecha_recibido).format('DD-MM-YYYY')}` },
                        { text: `${moment(element.fecha_recibido).format('HH:mm:ss')}` },
                        { text: `Cantidad: ${element.cantidad}` }
                    ],
                    `${element.motivo}`

                ])
        })
    }
    else {
        destinatario = ""
        dataWorkflow.push([{ text: 'El tramite aun no ha sido enviado', colSpan: 5 }, '', '', '', ''])
    }
    docDefinition = {
        content: [
            {
                columns: [
                    {
                        image: logo,
                        width: 120,
                        height: 60,
                        alignment: 'left',
                    },
                    {
                        text: `DETALLE HOJAS DE RUTA ÚNICA DE CORRESPONDENCIA\n\n`,
                        style: 'title',
                        alignment: 'center',
                        width: 300
                    },
                    [
                        {
                            image: logo2,
                            width: 100,
                            height: 50,
                            alignment: 'right',
                        },
                        {
                            width: 160,
                            fontSize: 8,
                            text: `Generado por: ${funcionario}\n Fecha: ${fecha_generacion}`,
                            alignment: 'right',
                        }

                    ]
                ]
            },
            
            {
                fontSize: 9,
                columns: [
                    [
                        { text: `CITE:${tramite.cite} ` },
                        { text: `FECHA REGISTRO: ${moment(tramite.fecha_registro).format('DD-MM-YYYY HH:mm:ss')} ` }
                    ],
                    [
                        { text: `NRO. REGISTRO INTERNO: ${tramite.cite} ` },
                        { text: `CANTIDAD: ${tramite.cantidad} ` },
                        { text: `ESTADO:${tramite.estado} ` }
                    ]
                ]
            },
            { text: `RERERENCIA: ${tramite.detalle}`, fontSize: 9 },
            { text: `REMITENTE: ${tramite.remitente.nombre} -  ${tramite.remitente.cargo}`, fontSize: 9 },
            { text: `DESTINATARIO: ${tramite.destinatario.nombre} -  ${tramite.destinatario.cargo}\n\n`, fontSize: 9 },
            
            { text: `UBICACION ACTUAL`, bold: true, fontSize: 9 },
            { text: `Encargado: ${tramite.ubicacion.funcionario.nombre} (${tramite.ubicacion.funcionario.cargo})`, bold: true, fontSize: 9 },
            { text: `Dependencia: ${tramite.ubicacion.dependencia.nombre} - ${tramite.ubicacion.dependencia.institucion.sigla}\n\n`, bold: true, fontSize: 9 },
            {
                style: 'tableExample',
                fontSize: 8,
                table: {
                    widths: ['*', '*', '*', '*', 100],
                    body: dataWorkflow
                }
            },
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
            tableHeader: {
                bold: true,
                fontSize: 10,
                color: 'black',
                fillColor: '#A8DADC'
            }
        }
    }
    pdfMake.createPdf(docDefinition).print();
}
