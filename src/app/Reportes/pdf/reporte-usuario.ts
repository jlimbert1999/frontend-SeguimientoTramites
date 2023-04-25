import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions, Table, TableOfContent } from "pdfmake/interfaces";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import { getBase64ImageFromUrl } from "src/assets/pdf-img/image-base64";
import { SendDataReportEvent } from "../models/sendData.model";
import { createHeaderParamsPDF } from "../helpers/PDFHeaderParams";


export async function createPDFUsuario({ params, data, group, extras }: SendDataReportEvent) {
    const logo: any = await getBase64ImageFromUrl('../../../assets/img/logo_alcaldia2.jpeg')
    const logo2: any = await getBase64ImageFromUrl('../../../assets/img/sigamos_adelante.jpg')
    let docDefinition: TDocumentDefinitions
    let tableUser: Table = {
        headerRows: 1,
        dontBreakRows: true,
        widths: ['*', '*'],
        body: [
            [
                { text: 'FUNCIONARIO', style: 'tableHeader', alignment: 'center' },
                { text: 'CARGO', style: 'tableHeader', alignment: 'center' },
            ],
            [
                extras.account.funcionario.fullname,
                extras.account.funcionario.cargo,
            ]
        ]
    }
    docDefinition = {
        pageOrientation: 'landscape',
        footer: { text: `Generado en fecha: ${moment(new Date()).format('DD-MM-YYYY HH:mm:ss')} `, margin: [20, 0, 0, 0] },
        content: [
            {
                columns: [
                    {
                        image: logo,
                        width: 120,
                        height: 50,
                        alignment: 'left',
                    },
                    {
                        text: `REPORTE USUARIO PARA TRAMITES ${group === 'tramites_externos' ? 'EXTERNOS' : 'INTERNOS'}`,
                        style: 'title',
                        alignment: 'center',
                        width: '*'
                    },
                    {
                        image: logo2,
                        width: 120,
                        height: 50,
                        alignment: 'right',
                    },
                ]
            },
            { text: '\nDetalles funcionario:\n ', style: 'subheader' },
            { table: tableUser },
            { text: '\nParametros de busqueda:\n ', style: 'subheader' },
            { table: createHeaderParamsPDF(params) },
            { text: `\nTOTAL RESULTADOS: ${data.length}\n `, style: 'subheader', alignment: 'center' },
            {
                style: 'tableExample',
                color: '#444',
                fontSize: 9,
                table: group === 'tramites_externos' ? createDataTableExternal(data) : createDataTableInternal(data)
            },

        ],
        styles: {
            header: {
                fontSize: 29,
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
    pdfMake.createPdf(docDefinition).open();
}

function createDataTableExternal(data: any[]): Table {
    let tableData: Table = {
        headerRows: 1,
        dontBreakRows: true,
        widths: [100, '*', 60, 200, 100],
        body: [[
            { text: 'Alterno', style: 'tableHeader', alignment: 'center' },
            { text: 'Descripcion', style: 'tableHeader', alignment: 'center' },
            { text: 'Estado', style: 'tableHeader', alignment: 'center' },
            { text: 'Solicitante', style: 'tableHeader', alignment: 'center' },
            { text: 'Fecha registro', style: 'tableHeader', alignment: 'center' }
        ]]
    }
    data.length > 0
        ? data.forEach(tramite => {
            tableData.body.push([
                tramite.alterno,
                tramite.detalle,
                tramite.estado,
                `${tramite.solicitante.nombre} ${tramite.solicitante.paterno ? tramite.solicitante.paterno : ''} ${tramite.solicitante.materno ? tramite.solicitante.materno : ''}`,
                moment(tramite.fecha_registro).format('DD-MM-YYYY HH:mm:ss')
            ])
        })
        : tableData.body.push(([{ text: 'No existen tramites con los parametros ingresados', colSpan: 5, fontSize: 14 }]))

    return tableData
}

function createDataTableInternal(data: any[]): Table {
    let tableData: Table = {
        headerRows: 1,
        dontBreakRows: true,
        widths: [100, '*', 60, 150, 150, 60],
        body: [[
            { text: 'Alterno', style: 'tableHeader', alignment: 'center' },
            { text: 'Descripcion', style: 'tableHeader', alignment: 'center' },
            { text: 'Estado', style: 'tableHeader', alignment: 'center' },
            { text: 'Remitente', style: 'tableHeader', alignment: 'center' },
            { text: 'Destinatario', style: 'tableHeader', alignment: 'center' },
            { text: 'Fecha registro', style: 'tableHeader', alignment: 'center' }
        ]]
    }
    data.length > 0
        ? data.forEach(tramite => {
            tableData.body.push([
                tramite.alterno,
                tramite.detalle,
                tramite.estado,
                tramite.remitente.nombre,
                `${tramite.destinatario.nombre}`,
                moment(tramite.fecha_registro).format('DD-MM-YYYY HH:mm:ss')
            ])
        })
        : tableData.body.push(([{ text: 'No existen tramites con los parametros ingresados', colSpan: 5, fontSize: 14 }]))

    return tableData
}
