import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions, Table, TableOfContent } from "pdfmake/interfaces";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import { getBase64ImageFromUrl } from "src/assets/pdf-img/image-base64";
import { SendDataReportEvent } from "../models/sendData.model";


export async function createPDFUnidad({ searchParams, data }: SendDataReportEvent) {
    const logo: any = await getBase64ImageFromUrl('../../../assets/img/logo_alcaldia2.jpeg')
    const logo2: any = await getBase64ImageFromUrl('../../../assets/img/sigamos_adelante.jpg')
    let docDefinition: TDocumentDefinitions
    let tableParams: Table = {
        headerRows: 1,
        dontBreakRows: true,
        widths: [150, '*'],
        body: [[{ text: 'CAMPO', style: 'tableHeader', alignment: 'center' }, { text: 'VALOR A BUSCAR', style: 'tableHeader', alignment: 'center' }]]

    }
    let tableData: Table = {
        headerRows: 1,
        dontBreakRows: true,
        body: [[
            { text: 'Alterno', style: 'tableHeader', alignment: 'center' },
            { text: 'Descripcion', style: 'tableHeader', alignment: 'center' },
            { text: 'Estado', style: 'tableHeader', alignment: 'center' },
            { text: 'Solicitante', style: 'tableHeader', alignment: 'center' },
            { text: 'Fecha registro', style: 'tableHeader', alignment: 'center' }
        ]]
    }
    searchParams.forEach(param => {
        tableParams.body.push(
            [{ text: param.field, bold: true }, { text: param.value }]
        )
    })

    if (data.length > 0) {
        // tramites.forEach(tramite => {
        //     tableData.body.push([
        //         tramite.alterno,
        //         tramite.detalle,
        //         tramite.estado,
        //         `${tramite.solicitante.nombre} ${tramite.solicitante.paterno ? tramite.solicitante.paterno : ''} ${tramite.solicitante.materno ? tramite.solicitante.materno : ''}`,
        //         moment(tramite.fecha_registro).format('DD-MM-YYYY HH:mm:ss')
        //     ])
        // })
    }
    else {
        tableData.body.push(([{ text: 'No existen tramites con los parametros del solicitante ingresados', colSpan: 5, fontSize: 18 }]))
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
                        text: `REPORTE UNIDAD`,
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
            { text: '\nParametros de busqueda:\n ', style: 'subheader' },
            { table: tableParams },
            { text: `\nTOTAL RESULTADOS:\n `, style: 'subheader', alignment: 'center' },
            {
                style: 'tableExample',
                color: '#444',
                fontSize: 9,
                table: tableData
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
