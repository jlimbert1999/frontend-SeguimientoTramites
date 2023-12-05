import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

import { procedure } from 'src/app/procedures/interfaces';
import { PDFReports } from '../pdf-reports';
import { Content } from 'pdfmake/interfaces';
import { convertImagenABase64 } from '../../imageBase64';

// export class PDFMake extends PDFReports {
//   override agenerateReportSheet(procedures: procedure[]): void {
//     const content: Content = [
//       {
//         style: 'cabecera',
//         columns: [
//           {
//             image: await convertImagenABase64('../../../assets/img/logo_alcaldia2.jpeg'),
//             width: 150,
//             height: 60,
//           },
//           {
//             text: '\nHOJA DE RUTA DE CORRESPONDENCIA',
//             bold: true,
//             alignment: 'center',
//           },
//           {
//             image: await convertImagenABase64('../../../assets/img/logo_sacaba.jpeg'),
//             width: 70,
//             height: 70,
//           },
//         ],
//       },
//     ];
//   }
// }
