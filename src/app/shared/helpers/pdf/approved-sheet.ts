import { Content } from 'pdfmake/interfaces';
import { convertImagenABase64 } from '../imageBase64';

async function createHeader(title: string, date: string = 'Aprobacion: 20/06/2023'): Promise<Content> {
  const image = await convertImagenABase64('../../../../assets/img/logo_alcaldia.png');
  return [
    {
      alignment: 'center',
      fontSize: 10,
      table: {
        heights: 10,
        widths: [50, 300, '*'],
        body: [
          [
            { rowSpan: 4, image: image, fit: [50, 50] },
            {
              rowSpan: 2,
              text: 'GOBIERNO ELECTRÓNICO Y SISTEMAS TECNOLÓGICOS',
            },
            'SF-000-74-RG31',
          ],
          ['', '', 'version 1'],
          [
            '',
            {
              rowSpan: 2,
              text: title,
            },
            date,
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
  ];
}

export const ApprovedSheet = {
  createHeader,
};
