import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { account } from '../../interfaces/account.interface';
import { convertImagenABase64 } from 'src/app/shared/helpers/imageBase64';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

export const createAccountPDF = async (account: account, password: string) => {
  try {
    const image = await convertImagenABase64(
      '../../../../assets/img/logo_alcaldia.png'
    );
    const docDefinition: TDocumentDefinitions = {
      pageSize: 'LETTER',
      content: [
        {
          style: 'Encabezado',
          table: {
            heights: 10,
            widths: [50, 300, '*'],
            body: [
              [
                { rowSpan: 4, image, fit: [50, 50] },
                {
                  rowSpan: 2,
                  text: 'GOBIERNO ELECTRÓNICO Y SISTEMAS TECNOLÓGICOS',
                },
                'SF-000-74-RG26',
              ],
              ['', '', 'version'],
              [
                '',
                {
                  rowSpan: 2,
                  text: 'ASIGNACION DE USUARIO DE SISTEMA DE SEGUIMIENTO DE TRAMITES INTERNOS Y EXTERNOS',
                },
                'Aprobacion',
              ],
              ['', '', 'pagina 1 de 1'],
            ],
          },
        },
        {
          text: `Fecha: ${new Date().toLocaleString()}`,
          style: 'header',
          alignment: 'right',
        },
        {
          text: [
            'NOMBRE: ',
            {
              text: `${account.funcionario?.nombre} ${account.funcionario?.paterno} ${account.funcionario?.materno}\n\n`.toUpperCase(),
              bold: false,
            },
            'CARGO: ',
            {
              text: `${
                account.funcionario?.cargo
                  ? account.funcionario.cargo.nombre
                  : 'SIN CARGO'
              }\n\n`,
              bold: false,
            },
            'UNIDAD: ',
            {
              text: `${account.dependencia.nombre} - ${account.dependencia.institucion.sigla}`.toUpperCase(),
              bold: false,
            },
          ],

          style: 'header',
          alignment: 'center',
          fontSize: 12,
        },
        {
          text: '\n\nCUENTA',
          style: 'header',
          alignment: 'center',
        },
        {
          text: [
            'Usuario: ',
            { text: `${account.login}\n\n`, bold: false },
            'Contraseña: ',
            { text: `${password ? password : '*********'}\n\n`, bold: false },
          ],
          style: 'header',
          alignment: 'center',
          fontSize: 12,
        },
        {
          text: 'La contraseña ingresada en el reporte debe ser cambiada una vez ingresada al sistema para que sea solo de conocimiento del usuario ',
          style: 'header',
          alignment: 'center',
          fontSize: 10,
        },
        {
          text: '\n\nEs responsabilidad del usuario el uso de la cuenta asignada\n\n',
          style: 'header',
          alignment: 'center',
          fontSize: 10,
        },

        {
          qr: `${account.funcionario?.nombre} ${account.funcionario?.paterno} ${account.funcionario?.materno} Dni: ${account.funcionario?.dni}`,
          alignment: 'right',
          fit: 100,
        },
        {
          columns: [
            {
              width: 90,
              text: '',
            },
            {
              width: '*',
              text: 'Sello y firma \n USUARIO',
              alignment: 'center',
            },
            {
              width: '*',
              text: 'Sello y firma \n ADMINISTRADOR',
              alignment: 'center',
            },
            {
              width: 90,
              text: '',
            },
          ],
        },
      ],
      styles: {
        header: {
          fontSize: 15,
          bold: true,
          alignment: 'right',
          margin: [0, 20, 0, 10],
        },
        subheader: {
          fontSize: 14,
        },
        superMargin: {
          margin: [20, 0, 40, 0],
          fontSize: 1,
        },
        tableExample: {
          alignment: 'center',
        },
        Encabezado: {
          fontSize: 11,
          alignment: 'center',
        },
      },
    };
    pdfMake.createPdf(docDefinition).open();
  } catch (error) {
    console.error(error);
  }
};
