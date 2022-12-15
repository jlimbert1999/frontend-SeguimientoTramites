import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from "pdfmake/interfaces";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import { getBase64ImageFromUrl } from "src/assets/pdf-img/image-base64";

export async function HojaFicha(tramite: any, workflow: any[], funcionario:string) {
    const imagePath_Alcaldia: any = await getBase64ImageFromUrl('../../../assets/img/logo_alcaldia2.jpeg')
    const logo2: any = await getBase64ImageFromUrl('../../../assets/img/sigamos_adelante.jpg')
    let fecha_generacion = moment(new Date()).format('DD-MM-YYYY HH:mm:ss')
    let docDefinition: TDocumentDefinitions
    let dataSolicitante: any[] = []
    let dataRepresentante: any[] = []
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

    switch (tramite.solicitante.tipo) {
        case 'NATURAL':
            dataSolicitante = [
                { text: '\nDATOS DEL SOLICITANTE\n', style: 'header' },
                { text: `Nombre: ${tramite.solicitante.nombre}` },
                { text: `Documento: ${tramite.solicitante.documento}` },
                { text: `Dni: ${tramite.solicitante.expedido} -${tramite.solicitante.dni}` },
                { text: `Telefono: ${tramite.solicitante.telefono}` },
            ]
            switch (tramite.representante) {
                case undefined:
                    dataRepresentante = [
                        { text: '\nDATOS DEL REPRESENTANTE\n', style: 'header' },
                        { text: `Nombre: ${tramite.solicitante.nombre}` },
                        { text: `Documento: ${tramite.solicitante.documento}` },
                        { text: `Dni: ${tramite.solicitante.expedido} -${tramite.solicitante.dni}` },
                        { text: `Telefono: ${tramite.solicitante.telefono}` },
                    ]
                    break;
                default:
                    dataRepresentante = [
                        { text: '\nDATOS DEL REPRESENTANTE\n', style: 'header' },
                        { text: `Nombre: ${tramite.representante.nombre}` },
                        { text: `Documento: ${tramite.representante.documento}` },
                        { text: `Dni: ${tramite.representante.expedido} -${tramite.solicitante.dni}` },
                        { text: `Telefono: ${tramite.representante.telefono}` },
                    ]
                    break;
            }
            break;
        case 'JURIDICO':
            dataSolicitante = [
                { text: '\nDATOS DEL SOLICITANTE\n', style: 'header' },
                { text: `Nombre: ${tramite.solicitante.nombre}` },
                { text: `Telefono: ${tramite.solicitante.telefono}` },
            ]
            switch (tramite.representante) {
                case undefined:
                    dataRepresentante = [
                        { text: '\nDATOS DEL REPRESENTANTE\n', style: 'header' },
                        { text: `Nombre: ${tramite.solicitante.nombre}` },
                        { text: `Documento: ${tramite.solicitante.documento}` },
                        { text: `Dni: ${tramite.solicitante.expedido} -${tramite.solicitante.dni}` },
                        { text: `Telefono: ${tramite.solicitante.telefono}` },
                    ]
                    break;
                default:
                    dataRepresentante = [
                        { text: '\nDATOS DEL REPRESENTANTE\n', style: 'header' },
                        { text: `Nombre: ${tramite.representante.nombre}` },
                        { text: `Documento: ${tramite.representante.documento}` },
                        { text: `Dni: ${tramite.representante.expedido} -${tramite.representante.dni}` },
                        { text: `Telefono: ${tramite.representante.telefono}` },
                    ]
                    break;
            }
            break;
    }


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
                        text: `REPORTE FICHA DE TRAMITE\n\n`,
                        style: 'title',
                        alignment: 'center',
                        width:250
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
           
            // {
            //     image: imagePath_Alcaldia,
            //     width: 100,
            //     height: 50,
            //     alignment: 'left',
            //     absolutePosition: { x: 30, y: 30 }
            // },
            // {
            //     text: ' REPORTE FICHA DE TRAMITE',
            //     style: 'title',
            //     alignment: 'center'
            // },
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
                }
            ],
            {
                columns: [
                    dataSolicitante,
                    dataRepresentante
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