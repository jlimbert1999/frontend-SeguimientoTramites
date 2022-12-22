import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from "pdfmake/interfaces";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import { getBase64ImageFromUrl } from "src/assets/pdf-img/image-base64";



export async function HojaEstadoInterno(tramites: any[], estado: string, funcionario: string) {
    const imagePath_Alcaldia: any = await getBase64ImageFromUrl('../../../assets/img/logo_alcaldia2.jpeg')
    const logo2: any = await getBase64ImageFromUrl('../../../assets/img/sigamos_adelante.jpg')
    let fecha_generacion = moment(new Date()).format('DD-MM-YYYY HH:mm:ss')
    let docDefinition: TDocumentDefinitions
    let dataTable: any[] = [[
        { text: 'Nro', style: 'tableHeader', alignment: 'center' },
        { text: 'Alterno', style: 'tableHeader', alignment: 'center' },
        { text: 'Descripcion', style: 'tableHeader', alignment: 'center' },
        { text: 'Remitente', style: 'tableHeader', alignment: 'center' },
        { text: 'Destinatario', style: 'tableHeader', alignment: 'center' },
        { text: 'Fecha registro', style: 'tableHeader', alignment: 'center' },
        { text: 'Ubicacion', style: 'tableHeader', alignment: 'center' },
    ]]
    tramites.forEach((element, index) => {
        dataTable.push([
            `${index + 1}`,
            `${element.alterno}`,
            `${element.detalle}`,
            `${element.remitente.nombre}\n${element.remitente.cargo}`,
            `${element.destinatario.nombre}\n${element.destinatario.cargo}`,
            `${moment(element.fecha_registro).format('DD-MM-YYYY HH:mm:ss')}`,
            `${element.ubicacion.dependencia.nombre}-${element.ubicacion.dependencia.institucion.sigla}`,
        ])
    })
    docDefinition = {
        pageOrientation: 'landscape',
        pageSize: 'LETTER',
        content: [

            {
                margin: [0, 0, 0, 20],
                columns: [
                    {
                        image: imagePath_Alcaldia,
                        width: 160,
                        height: 70,
                        alignment: 'left',
                    },
                    {
                        text: ` REPORTE ESTADO "${estado}"\n\n`,
                        style: 'title',
                        alignment: 'center',
                        width: 400
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
                style: 'tableExample',
                table: {
                    widths: [20, '*', '*', '*', '*', '*', '*'],
                    body: dataTable
                }
            }
        ],
        styles: {
            title: {
                fontSize: 14,
                bold: true
            },
            tableHeader: {
                bold: true,
                fontSize: 10,
                color: 'black'
            },
            tableExample: {
                fontSize: 8
            }
        }
    }
    pdfMake.createPdf(docDefinition).print();

}



