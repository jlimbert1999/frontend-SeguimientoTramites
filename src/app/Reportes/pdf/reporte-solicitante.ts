import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from "pdfmake/interfaces";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import { getBase64ImageFromUrl } from "src/assets/pdf-img/image-base64";

export async function PDF_Solicitante(funcionario: string, parametros: any, tramites: any[]) {
    const logo: any = await getBase64ImageFromUrl('../../../assets/img/logo_alcaldia2.jpeg')
    const logo2: any = await getBase64ImageFromUrl('../../../assets/img/sigamos_adelante.jpg')
    let docDefinition: TDocumentDefinitions
    let tableParams: any[] = [[{ text: 'CAMPO', style: 'tableHeader', alignment: 'center' }, { text: 'VALOR A BUSCAR', style: 'tableHeader', alignment: 'center' }]]
    let tableData: any[] = [[
        { text: 'Alterno', style: 'tableHeader', alignment: 'center' },
        { text: 'Descripcion', style: 'tableHeader', alignment: 'center' },
        { text: 'Estado', style: 'tableHeader', alignment: 'center' },
        { text: 'Solicitante', style: 'tableHeader', alignment: 'center' },
        { text: 'Fecha registro', style: 'tableHeader', alignment: 'center' }]]
    Object.keys(parametros).forEach((key: string) => {
        tableParams.push(
            [{ text: key.toUpperCase(), bold: true }, { text: parametros[key].toUpperCase() }]
        )
    });
    if (tramites.length > 0) {
        tramites.forEach(tramite => {
            tableData.push([
                tramite.alterno,
                tramite.detalle,
                tramite.estado,
                `${tramite.solicitante.nombre} ${tramite.solicitante.paterno} ${tramite.solicitante.paterno}`,
                moment(tramite.fecha_registro).format('DD-MM-YYYY HH:mm:ss')
            ])
        })
    }
    else {
        tableData.push([{ text: 'No existen tramites con los parametros del solicitante ingresados', colSpan: 5, fontSize: 18 }])
    }

    docDefinition = {
        pageOrientation: 'landscape',
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
                        text: `REPORTE SOLICITANTE`,
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
            {
                style: 'tableExample',
                color: '#444',
                fontSize: 12,
                table: {
                    widths: [150, '*'],
                    body: tableParams
                }
            },
            { text: `\nLISTADO DE TRAMITES\n `, style: 'subheader', alignment: 'center' },
            { text: `Total: ${tramites.length}\n\n`, style: 'subheader' },
            {
                style: 'tableExample',
                color: '#444',
                fontSize: 9,
                table: {
                    widths: [120, '*', 50, 150, 100],
                    body: tableData
                }
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
