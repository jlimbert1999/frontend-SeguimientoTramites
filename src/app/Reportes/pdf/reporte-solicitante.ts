import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions, Table, TableOfContent } from "pdfmake/interfaces";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import { convertImagenABase64 } from "src/app/shared/helpers/imageBase64";


export async function createPDFSolicitante(parametros: any, tramites: any[]) {
    const logo: any = await convertImagenABase64('../../../assets/img/logo_alcaldia2.jpeg')
    const logo2: any = await convertImagenABase64('../../../assets/img/sigamos_adelante.jpg')
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
    Object.keys(parametros).forEach((key: string) => {
        if (key === 'start' && parametros[key]) {
            tableParams.body.push(
                [{ text: 'FECHA INICIAL', bold: true }, { text: moment(parametros[key]).format('DD-MM-YYYY HH:mm:ss') }]
            )
        }
        else if (key === 'end' && parametros[key]) {
            tableParams.body.push(
                [{ text: 'FECHA FIN', bold: true }, { text: moment(parametros[key]).format('DD-MM-YYYY HH:mm:ss') }]
            )
        }
        else {
            tableParams.body.push(
                [{ text: key.toUpperCase(), bold: true }, { text: parametros[key].toUpperCase() }]
            )
        }
    });

    if (tramites.length > 0) {
        tramites.forEach(tramite => {
            tableData.body.push([
                tramite.alterno,
                tramite.detalle,
                tramite.estado,
                `${tramite.solicitante.nombre} ${tramite.solicitante.paterno ? tramite.solicitante.paterno : ''} ${tramite.solicitante.materno ? tramite.solicitante.materno : ''}`,
                moment(tramite.fecha_registro).format('DD-MM-YYYY HH:mm:ss')
            ])
        })
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
            { table: tableParams },
            { text: `\nTOTAL RESULTADOS: ${tramites.length} \n `, style: 'subheader', alignment: 'center' },
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
