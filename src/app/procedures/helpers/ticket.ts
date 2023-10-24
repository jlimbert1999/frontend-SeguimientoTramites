import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import { convertImagenABase64 } from 'src/app/shared/helpers/imageBase64';
import { external } from '../interfaces';

export const createTicket = async (procedure: external) => {
  const {
    details: { solicitante, pin },
    startDate,
    code,
  } = procedure;
  const fullnameApplicant =
    solicitante.tipo === 'NATURAL'
      ? `${solicitante.nombre} ${solicitante.paterno} ${solicitante.materno}`
      : `${solicitante.nombre}`;
  const docDefinition: TDocumentDefinitions = {
    pageSize: 'A6',
    content: [
      {
        image: await convertImagenABase64(
          '../../../assets/img/logo_alcaldia2.jpeg'
        ),
        width: 180,
        height: 70,
        alignment: 'center',
      },
      {
        text: '\n\nGOBIERNO AUTONOMO MUNICIPAL DE SACABA.\n\n',
        alignment: 'center',
      },
      {
        text: `Tramite: ${code}\n\n`,
        alignment: 'center',
      },
      {
        text: `Fecha registro:  ${moment(new Date(startDate)).format(
          'DD-MM-YYYY HH:mm:ss'
        )}\n\n`,
        alignment: 'center',
      },
      {
        text: `Pin: ${pin}\n\n`,
        alignment: 'center',
      },
      {
        text: `Solicitante: ${fullnameApplicant}`,
        alignment: 'center',
      },
    ],
    styles: {
      header: {
        fontSize: 14,
        bold: true,
        alignment: 'justify',
      },
    },
  };
  pdfMake.createPdf(docDefinition).print();
};
