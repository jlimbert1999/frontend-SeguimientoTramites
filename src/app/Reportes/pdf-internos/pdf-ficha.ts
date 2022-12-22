import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from "pdfmake/interfaces";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import { getBase64ImageFromUrl } from "src/assets/pdf-img/image-base64";

export async function HojaFichaInterna(tramite: any, workflow: any[], funcionario: string) {
    const imagePath_Alcaldia: any = await getBase64ImageFromUrl('../../../assets/img/logo_alcaldia2.jpeg')
    const logo2: any = await getBase64ImageFromUrl('../../../assets/img/sigamos_adelante.jpg')
    let fecha_generacion = moment(new Date()).format('DD-MM-YYYY HH:mm:ss')
    let docDefinition: TDocumentDefinitions
    let dataRemitente: any[] = []
    let dataDestinatario: any[] = []
    let dataWorkflow: any
    if (workflow.length > 0) {
        dataWorkflow = {
            style: 'tableExample',
            fontSize: 9,
            table: {
                body: [
                    [{ text: 'Emision', style: 'tableHeader', alignment: 'center' }, { text: 'Recepcion', style: 'tableHeader', alignment: 'center' }, { text: 'Dependencia origen', style: 'tableHeader', alignment: 'center' }, { text: 'Dependencia destino', style: 'tableHeader', alignment: 'center' }],
                ]
            }
        }
        workflow.forEach(element => {
            dataWorkflow.table.body.push([`${moment(element.fecha_envio).format('DD-MM-YYYY HH:mm:ss')}`, `${moment(element.fecha_recibido).format('DD-MM-YYYY HH:mm:ss')}`, `${element.emisor.cuenta.dependencia.nombre} - ${element.emisor.cuenta.dependencia.institucion.sigla}`, `${element.receptor.cuenta.dependencia.nombre} - ${element.receptor.cuenta.dependencia.institucion.sigla}`])
        })
    }
    else {
        dataWorkflow = {
            text: 'El tramite no ha sido remitido',
            alignment: 'center'
        }
    }
    dataRemitente = [
        { text: '\nDATOS DEL REMITENTE\n', style: 'header', fontSize: 9 },
        { text: `Nombre: ${tramite.remitente.nombre}`, fontSize: 9 },
        { text: `Cargo: ${tramite.remitente.cargo}`, fontSize: 9 },
    ]
    dataDestinatario = [
        { text: '\nDATOS DEL DESTINATARIO\n', style: 'header', fontSize: 9 },
        { text: `Nombre: ${tramite.destinatario.nombre}`, fontSize: 9 },
        { text: `Cargo: ${tramite.destinatario.cargo}`, fontSize: 9 },
    ]
    docDefinition = {
        content: [
            {
                columns: [
                    {
                        image: imagePath_Alcaldia,
                        width: 130,
                        height: 60,
                        alignment: 'left',
                    },
                    {
                        text: `REPORTE FICHA DE TRAMITE INTERNO\n\n`,
                        style: 'title',
                        alignment: 'center',
                        width: 240
                    },
                    [
                        {
                            image: logo2,
                            width: 100,
                            height: 50,
                            alignment: 'right'

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
            [
                { text: `\n\nTipo: ${tramite.tipo_tramite.nombre}` },
                { text: `Detalle: ${tramite.detalle}` },
                { text: `Alterno: ${tramite.alterno}` },
                {
                    columns: [
                        [
                            { text: `Cantidad: ${tramite.cantidad}` },
                            { text: `Estado: ${tramite.estado}` },
                        ],
                        [
                            { text: `Cite: ${tramite.cite ? tramite.cite : ''}` },
                            { text: `Fecha registro:${moment(tramite.fecha_registro).format('DD-MM-YYYY HH:mm:ss')}` },
                        ]
                    ]
                },
                { text: `\n UBICACION ACTUAL`, bold: true, fontSize: 9 },
                { text: `Encargado: ${tramite.ubicacion.funcionario.nombre} (${tramite.ubicacion.funcionario.cargo})`, bold: true, fontSize: 9 },
                { text: `Dependencia: ${tramite.ubicacion.dependencia.nombre} - ${tramite.ubicacion.dependencia.institucion.sigla}`, bold: true, fontSize: 9 },
            ],
            {
                columns: [
                    dataRemitente,
                    dataDestinatario
                ]
            },
            {
                text: '\nRUTA DEL TRAMITE\n\n',
                style: 'header',
                alignment: 'center'
            },
            dataWorkflow
        ],
        styles: {
            header: {
                fontSize: 13,
                bold: true
            },
            title: {
                fontSize: 14,
                bold: true
            },
            tableHeader: {
                bold: true,
                fontSize: 10,
                color: 'black'
            }
        }
    }
    pdfMake.createPdf(docDefinition).print();
}