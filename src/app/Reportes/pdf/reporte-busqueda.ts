import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from "pdfmake/interfaces";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import { getBase64ImageFromUrl } from "src/assets/pdf-img/image-base64";

export async function PDF_busqueda(funcionario: string, grupo: 'INTERNO' | 'EXTERNO', parametros: any[], data: any[], total: number) {
    const logo: any = await getBase64ImageFromUrl('../../../assets/img/logo_alcaldia2.jpeg')
    const logo2: any = await getBase64ImageFromUrl('../../../assets/img/sigamos_adelante.jpg')
    let tableParams: any[] = [
        [{ text: 'CAMPO', style: 'tableHeader', alignment: 'center' }, { text: 'VALOR A BUSCAR', style: 'tableHeader', alignment: 'center' }],
    ]
    let tableData: any[] = []
    parametros.forEach(parametro => {
        tableParams.push(
            [{ text: parametro[0].toUpperCase(), bold: true }, { text: parametro[1] }],
        )
    })
    if (grupo === 'EXTERNO') {
        tableData.push([
            { text: 'Alterno', style: 'tableHeader', alignment: 'center' },
            { text: 'Descripcion', style: 'tableHeader', alignment: 'center' }])
        data.forEach(element => {
            tableData.push([element.alterno, element.detalle])
        })
    }
    else {
        tableData.push([
            { text: 'Alterno', style: 'tableHeader', alignment: 'center' },
            { text: 'Descripcion', style: 'tableHeader', alignment: 'center' }])
        data.forEach(element => {
            tableData.push([element.alterno, element.detalle])
        })
    }
    let docDefinition: TDocumentDefinitions
    docDefinition = {
        footer: [
            { text: `Generado por: ${funcionario} `, margin: [20, 0, 0, 0] },
            { text: `Fecha: ${moment(new Date()).format('DD-MM-YYYY HH:mm:ss')} `, margin: [20, 0, 0, 0] }
        ],
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
                        text: `Reporte busqueda de Tramite\n\n ${grupo}`,
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
            { text: '\nParametros de busqueda: ', style: 'subheader' },
            {
                style: 'tableExample',
                color: '#444',
                fontSize: 12,
                table: {

                    widths: [150, '*'],
                    body: tableParams
                }
            },
            {
                text: `\nTotal resultados: ${total}`, style: 'subheader'
            },
            {
                style: 'tableExample',
                color: '#444',
                fontSize: 12,
                table: {

                    widths: [150, '*'],
                    body: tableData
                }
            },
        ],
        styles: {
            title: {
                bold: true,
                fontSize: 14
            },
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 16,
                bold: true,
                // margin: [0, 10, 0, 5]
            },
            tableExample: {
                fontSize: 6
            },
            tableHeader: {
                bold: true,
                fontSize: 13
            }
        },
    }
    pdfMake.createPdf(docDefinition).open();
}
