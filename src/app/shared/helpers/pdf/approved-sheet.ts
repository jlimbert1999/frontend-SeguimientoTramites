import { Content } from 'pdfmake/interfaces';
import { convertImagenABase64 } from '../imageBase64';

interface HeaderProps {
  title: string;
  date: string;
  code: string;
}
async function createHeader({ title, date, code }: HeaderProps): Promise<Content> {
  const image = await convertImagenABase64('../../../../assets/img/logo_nombre.jpeg');
  return [
    {
      alignment: 'center',
      fontSize: 10,
      table: {
        heights: 10,
        widths: [70, 300, '*'],
        body: [
          [
            { rowSpan: 4, image: image, fit: [100, 70] },
            {
              rowSpan: 2,
              text: 'GOBIERNO ELECTRÓNICO',
            },
            code,
          ],
          ['', '', 'version 1'],
          [
            '',
            {
              rowSpan: 2,
              text: title,
            },
            `Aprobacion ${date}`,
          ],
          ['', '', 'pagina 1 de 1'],
        ],
      },
    },
    {
      text: `Fecha: ${new Date().toLocaleString()}`,
      marginTop: 20,
      style: 'header',
      alignment: 'right',
    },
  ];
}

export const ApprovedSheet = {
  createHeader,
};
