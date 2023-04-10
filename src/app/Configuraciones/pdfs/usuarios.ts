import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { Cuenta } from "../models/cuenta.interface";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

export const HojaUsuarios = async (cuenta: Cuenta, login: string, password: string) => {
    const imagePath = await getBase64ImageFromUrl('../../../assets/img/logo_alcaldia.png')
    let docDefinition: TDocumentDefinitions = {
        pageSize: 'LETTER',
        content: [
            {
                style: 'Encabezado',
                table: {
                    heights: 10,
                    widths: [50, 300, '*'],
                    body: [
                        [{ rowSpan: 4, image: imagePath, fit: [50, 50] }, { rowSpan: 2, text: 'GOBIERNO ELECTRÓNICO Y SISTEMAS TECNOLÓGICOS' }, 'SF-000-74-RG26'],
                        ['', '', 'version'],
                        ['', { rowSpan: 2, text: 'ASIGNACION DE USUARIO DE SISTEMA DE SEGUIMIENTO DE TRAMITES INTERNOS Y EXTERNOS' }, "Aprobacion"],
                        ['', '', 'pagina 1 de 1'],
                    ]
                }
            },
            {
                text: `Fecha: ${new Date().toLocaleString()}`,
                style: 'header',
                alignment: 'right'
            },
            {
                text: [
                    'NOMBRE: ', { text: `${cuenta.funcionario?.nombre} ${cuenta.funcionario?.paterno} ${cuenta.funcionario?.materno}\n\n`.toUpperCase(), bold: false },
                    'CARGO: ', { text: `${cuenta.funcionario?.cargo}\n\n`.toUpperCase(), bold: false },
                    'UNIDAD: ', { text: `${cuenta.dependencia.nombre} - ${cuenta.dependencia.institucion.sigla}`.toUpperCase(), bold: false },
                ],

                style: 'header',
                alignment: 'center',
                fontSize: 12
            },
            {
                text: '\n\nCUENTA',
                style: 'header',
                alignment: 'center'
            },
            {
                text: [
                    'Usuario: ', { text: `${login}\n\n`, bold: false },
                    'Contraseña: ', { text: `${password != undefined ? password : 'Sin cambios'}\n\n`, bold: false }
                ],

                style: 'header',
                alignment: 'center',
                fontSize: 12
            },
            {
                text: 'La contraseña ingresada en el reporte debe ser cambiada una vez ingresada al sistema para que sea solo de conocimiento del usuario ',
                style: 'header',
                alignment: 'center',
                fontSize: 10
            },
            {
                text: '\n\nEs responsabilidad del usuario el uso de la cuenta asignada\n\n',
                style: 'header',
                alignment: 'center',
                fontSize: 10
            },

            { qr: `${cuenta.funcionario?.nombre} ${cuenta.funcionario?.paterno} ${cuenta.funcionario?.materno} Dni: ${cuenta.funcionario?.dni}`, alignment: 'right', fit: 100 },
            {
                columns: [
                    {
                        width: 90,
                        text: ''
                    },
                    {
                        width: '*',
                        text: 'Sello y firma \n USUARIO',
                        alignment: 'center',
                    },
                    {
                        width: '*',
                        text: 'Sello y firma \n ADMINISTRADOR',
                        alignment: 'center'
                    },
                    {
                        width: 90,
                        text: ''
                    }
                ]
            },
        ],
        styles: {
            header: {
                fontSize: 15,
                bold: true,
                alignment: 'right',
                margin: [0, 20, 0, 10]
            },
            subheader: {
                fontSize: 14
            },
            superMargin: {
                margin: [20, 0, 40, 0],
                fontSize: 1
            },
            tableExample: {
                alignment: 'center'

            },
            Encabezado: {
                fontSize: 11,
                alignment: 'center'
            }

        }

    };
    pdfMake.createPdf(docDefinition).open();
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