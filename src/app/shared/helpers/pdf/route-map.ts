import { Content, ContentTable, TableCell } from 'pdfmake/interfaces';
import { convertImagenABase64, toOrdinal } from '../';

import { Workflow } from 'src/app/communication/models';
import { groupProcedure } from 'src/app/procedures/interfaces';
import { Procedure } from 'src/app/procedures/models';

async function CreateHeader(): Promise<Content> {
  return [
    {
      style: 'cabecera',
      columns: [
        {
          image: await convertImagenABase64('../../../assets/img/logo_alcaldia2.jpeg'),
          width: 150,
          height: 60,
        },
        {
          text: '\nHOJA DE RUTA DE CORRESPONDENCIA',
          bold: true,
          alignment: 'center',
        },
        {
          image: await convertImagenABase64('../../../assets/img/logo_sacaba.jpeg'),
          width: 70,
          height: 70,
        },
      ],
    },
  ];
}

function CreateFirstSection(procedure: Procedure, firstStage?: Workflow) {
  const {
    applicantDetails: { emiter, receiver },
  } = procedure;
  const firstSendDetails = firstStage
    ? {
        receiver: {
          fullname: firstStage.detail[0].receiver.fullname,
          jobtitle: firstStage.detail[0].receiver.jobtitle ?? '',
        },
        quantity: firstStage.detail[0].attachmentQuantity,
        internalNumber: firstStage.detail[0].internalNumber,
        date: firstStage.outboundDate.date,
        hour: firstStage.outboundDate.hour,
      }
    : {
        receiver: {
          fullname: receiver.nombre,
          jobtitle: receiver.cargo,
        },
        date: '',
        hour: '',
        quantity: '',
        internalNumber: '',
      };
  return {
    fontSize: 7,
    table: {
      widths: ['*'],
      body: [
        [{ text: 'PRIMERA PARTE', bold: true }],
        [
          {
            border: [true, false, true, false],
            style: 'selection_container',
            fontSize: 6,
            columns: [
              {
                width: 100,
                table: {
                  widths: [75, 5],
                  body: [
                    [
                      {
                        text: 'CORRESPONDENCIA INTERNA',
                        border: [false, false, false, false],
                      },
                      { text: procedure.group === groupProcedure.INTERNAL ? 'X' : '', style: 'header' },
                    ],
                  ],
                },
              },
              {
                width: 100,
                table: {
                  widths: [75, 5],
                  body: [
                    [
                      {
                        text: 'CORRESPONDENCIA EXTERNA',
                        border: [false, false, false, false],
                      },
                      { text: procedure.group === groupProcedure.EXTERNAL ? 'X' : '', style: 'header' },
                    ],
                  ],
                },
              },
              {
                width: 50,
                table: {
                  widths: [30, 5],
                  body: [
                    [
                      {
                        text: 'COPIA\n\n',
                        border: [false, false, false, false],
                      },
                      { text: '', style: 'header' },
                    ],
                  ],
                },
              },
              {
                width: '*',
                table: {
                  widths: [90, '*'],
                  body: [
                    [
                      {
                        text: 'NRO. UNICO DE CORRESPONDENCIA',
                        border: [false, false, false, false],
                      },
                      {
                        text: `${procedure.code}`,
                        bold: true,
                        fontSize: 11,
                      },
                    ],
                  ],
                },
              },
            ],
          },
        ],
        [
          {
            border: [true, false, true, false],
            columns: [
              {
                width: 60,
                text: '',
              },
              {
                fontSize: 5,
                alignment: 'center',
                table: {
                  widths: [100, 70, 60, 80],
                  body: [
                    ['', 'FECHA', 'HORA', 'CANTIDAD DE HOJAS / ANEXOS'],
                    [
                      {
                        text: 'EMISION / RECEPCION',
                        border: [false, false, false, false],
                        fontSize: 7,
                      },
                      {
                        text: `${procedure.StartDateDetail().date}`,
                        fontSize: 8,
                        border: [true, true, true, true],
                      },
                      {
                        text: `${procedure.StartDateDetail().hour}`,
                        fontSize: 8,
                        border: [true, true, true, true],
                      },
                      {
                        text: `${procedure.amount}`,
                        fontSize: 6,
                        border: [true, true, true, true],
                      },
                    ],
                  ],
                },
                layout: {
                  defaultBorder: false,
                },
              },
              {
                width: 120,
                text: '',
              },
            ],
          },
        ],
        [
          {
            border: [true, false, true, false],
            table: {
              widths: ['*', '*'],
              body: [
                [{ text: 'DATOS DE ORIGEN', bold: true }, ''],
                [
                  `CITE: ${procedure.cite}`,
                  {
                    table: {
                      widths: [85, 100, 40],
                      body: [
                        [
                          { text: '', border: [false, false, false, false] },
                          {
                            text: 'NRO. REGISTRO INTERNO (Correlativo)',
                            border: [false, false, false, false],
                          },
                          {
                            text: `${firstSendDetails.internalNumber}`,
                            fontSize: 9,
                            alignment: 'center',
                          },
                        ],
                      ],
                    },
                  },
                ],
                [`REMITENTE: ${emiter.nombre}`, `CARGO: ${emiter.cargo}`],
                [`DESTINATARIO: ${firstSendDetails.receiver.fullname}`, `CARGO: ${firstSendDetails.receiver.jobtitle}`],
                [{ text: `REFERENCIA: ${procedure.reference}`, colSpan: 2 }],
              ],
            },
            layout: 'noBorders',
          },
        ],
        [
          {
            border: [true, false, true, false],
            columns: [
              {
                width: 65,
                text: '',
              },
              {
                fontSize: 5,
                alignment: 'center',
                table: {
                  widths: [95, 70, 60, 80],
                  body: [
                    ['', 'FECHA', 'HORA', 'CANTIDAD DE HOJAS / ANEXOS'],
                    [
                      {
                        text: 'SALIDA',
                        border: [false, false, false, false],
                        fontSize: 7,
                      },
                      {
                        text: `${firstSendDetails.date}`,
                        border: [true, true, true, true],
                        fontSize: 8,
                      },
                      {
                        text: `${firstSendDetails.hour}`,
                        border: [true, true, true, true],
                        fontSize: 8,
                      },
                      {
                        text: `${firstSendDetails.quantity}`,
                        border: [true, true, true, true],
                        fontSize: 6,
                      },
                    ],
                  ],
                },
                layout: {
                  defaultBorder: false,
                },
              },
              {
                width: 100,
                text: '',
              },
            ],
          },
        ],
      ],
    },
  };
}

function CreateSecodSection(workflow: Workflow[]) {
  const lastNumberPage = getLastPageNumber(workflow.length);
  if (workflow.length === 0) return createWhiteContainers(workflow.length + 1, lastNumberPage);
  return [
    ...createContainers(workflow),
    createWhiteContainers(workflow.length + 1, getLastPageNumber(workflow.length)),
  ];
}
function getLastPageNumber(lengthData: number): number {
  if (lengthData <= 8) return 8;
  const firstTerm = 3;
  const increment = 5;
  const termsBefore = Math.ceil((lengthData - firstTerm) / increment);
  const nextTerm = firstTerm + termsBefore * increment;
  return nextTerm;
}

function createContainers(workflow: Workflow[]) {
  const cuadros: ContentTable[] = [];
  for (let index = 0; index < workflow.length; index++) {
    const receivers: string[] = [];
    const sectionDates: TableCell[][] = [];
    const sectionNumbers: TableCell[][] = [];
    if (workflow[index].detail.length > 1) {
      workflow[index].detail.forEach((element) => {
        receivers.push(`${element.receiver.fullname} (${element.receiver.jobtitle})`);
      });
      cuadros.push({
        fontSize: 7,
        unbreakable: true,
        table: {
          dontBreakRows: true,
          widths: [360, '*'],
          body: [
            [
              {
                margin: [0, 10, 0, 0],
                text: `DESTINATARIO ${toOrdinal(index+1)} (NOMBRE Y CARGO): ${receivers.join(' // ')}`.toUpperCase(),
                colSpan: 2,
                alignment: 'left',
                border: [true, false, true, false],
              },
              '',
            ],
            [
              {
                border: [true, false, false, false],
                table: {
                  body: [
                    [
                      {
                        table: {
                          heights: 70,
                          widths: [70],
                          body: [
                            [
                              {
                                text: 'SELLO DE RECEPCION',
                                fontSize: 4,
                                alignment: 'center',
                              },
                            ],
                          ],
                        },
                      },
                      [{ text: 'INSTRUCCION / PROVEIDO' }, { text: ``, bold: true }],
                    ],
                  ],
                },
                layout: {
                  defaultBorder: false,
                },
              },
              {
                rowSpan: 1,
                border: [false, false, true, false],
                table: {
                  widths: [100, 40],
                  body: [
                    [
                      {
                        text: 'NRO. REGISTRO INTERNO (Correlativo)',
                        border: [false, false, false, false],
                      },
                      { text: `` },
                    ],
                    [
                      {
                        text: '\n\n\n\n-----------------------------------------',
                        colSpan: 2,
                        border: [false, false, false, false],
                        alignment: 'right',
                      },
                    ],
                    [
                      {
                        text: 'FIRMA Y SELLO',
                        colSpan: 2,
                        border: [false, false, false, false],
                        alignment: 'right',
                      },
                    ],
                  ],
                },
              },
            ],
            [
              {
                colSpan: 2,
                border: [true, false, true, true],
                alignment: 'center',
                fontSize: 5,
                table: {
                  widths: [30, 45, 35, '*', 30, 45, 35, '*'],
                  body: [
                    [
                      '',
                      'FECHA',
                      'HORA',
                      'CANTIDAD DE HOJAS / ANEXOS',
                      '',
                      'FECHA',
                      'HORA',
                      'CANTIDAD DE HOJAS / ANEXOS',
                    ],
                    [
                      {
                        text: 'INGRESO',
                        border: [false, false, false, false],
                        fontSize: 7,
                      },
                      { text: ``, fontSize: 8, border: [true, true, true, true] },
                      { text: ``, fontSize: 8, border: [true, true, true, true] },
                      { text: ``, fontSize: 6, border: [true, true, true, true] },
                      {
                        text: 'SALIDA',
                        border: [false, false, false, false],
                        fontSize: 7,
                      },
                      { text: ``, border: [true, true, true, true], fontSize: 8 },
                      { text: ``, border: [true, true, true, true], fontSize: 8 },
                      { text: ``, border: [true, true, true, true], fontSize: 6 },
                    ],
                  ],
                },
                layout: {
                  defaultBorder: false,
                },
              },
            ],
          ],
        },
      });
     
      break;
    }
    workflow[index].detail.forEach((stage) => {
      receivers.push(`${stage.receiver.fullname} (${stage.receiver.jobtitle})`);
      const inDetails = stage.inboundDate
        ? {
            date: stage.inboundDate.date,
            hour: stage.inboundDate.hour,
            quantity: stage.attachmentQuantity,
            inNumber: stage.internalNumber,
          }
        : { date: '', hour: '', inNumber: '', quantity: '' };
      const nextSend = workflow
        .slice(index, workflow.length)
        .find((nextSend) => nextSend.emitter.cuenta === stage.receiver.cuenta);
      const outDetails = nextSend
        ? {
            date: nextSend.outboundDate.date,
            hour: nextSend.outboundDate.hour,
            quantity: nextSend.detail[0].attachmentQuantity,
            inNumber: nextSend.detail[0].internalNumber,
          }
        : { date: '', hour: '', quantity: '', inNumber: '' };
      sectionDates.push(
        ['', 'FECHA', 'HORA', 'CANTIDAD DE HOJAS / ANEXOS', '', 'FECHA', 'HORA', 'CANTIDAD DE HOJAS / ANEXOS'],
        [
          {
            text: `INGRESO `,
            border: [false, false, false, false],
            fontSize: 7,
          },
          {
            text: `${inDetails.date}`,
            fontSize: 8,
            border: [true, true, true, true],
          },
          {
            text: `${inDetails.hour}`,
            fontSize: 8,
            border: [true, true, true, true],
          },
          {
            text: `${inDetails.quantity}`,
            fontSize: 6,
            border: [true, true, true, true],
          },
          { text: `SALIDA`, border: [false, false, false, false], fontSize: 7 },
          {
            text: `${outDetails.date}`,
            border: [true, true, true, true],
            fontSize: 8,
          },
          {
            text: `${outDetails.hour}`,
            border: [true, true, true, true],
            fontSize: 8,
          },
          {
            text: `${outDetails.quantity}`,
            border: [true, true, true, true],
            fontSize: 6,
          },
        ]
      );
      sectionNumbers.push([
        {
          text: `NRO. REGISTRO INTERNO (Correlativo)`,
          border: [false, false, false, false],
        },
        { text: `${outDetails.inNumber}`, alignment: 'center' },
      ]);
    });
    sectionNumbers.push(
      [
        {
          text: '\n\n\n\n-----------------------------------------',
          colSpan: 2,
          border: [false, false, false, false],
          alignment: 'right',
        },
      ],
      [
        {
          text: 'FIRMA Y SELLO',
          colSpan: 2,
          border: [false, false, false, false],
          alignment: 'right',
        },
      ]
    );
    cuadros.push({
      fontSize: 7,
      unbreakable: true,
      table: {
        dontBreakRows: true,
        widths: [360, '*'],
        body: [
          [
            {
              margin: [0, 0, 0, 0],
              text: `DESTINATARIO ${toOrdinal(index + 1)} (NOMBRE Y CARGO): ${receivers.join(' // ')}`.toUpperCase(),
              colSpan: 2,
              alignment: 'left',
              border: [true, false, true, false],
            },
            '',
          ],
          [
            {
              border: [true, false, false, false],
              table: {
                widths: [80, 300],
                body: [
                  [
                    {
                      table: {
                        heights: 70,
                        widths: [70],
                        body: [
                          [
                            {
                              text: 'SELLO DE RECEPCION',
                              fontSize: 4,
                              alignment: 'center',
                            },
                          ],
                        ],
                      },
                    },
                    [
                      { text: 'INSTRUCCION / PROVEIDO' },
                      {
                        text: `\n\n${workflow[index].detail[0].reference}`,
                        bold: true,
                        alignment: 'center',
                      },
                    ],
                  ],
                ],
              },
              layout: {
                defaultBorder: false,
              },
            },
            {
              rowSpan: 1,
              border: [false, false, true, false],
              table: {
                widths: [100, 40],
                body: sectionNumbers,
              },
            },
          ],
          [
            {
              colSpan: 2,
              border: [true, false, true, true],
              alignment: 'center',
              fontSize: 5,
              table: {
                widths: [30, 45, 35, '*', 30, 45, 35, '*'],
                body: sectionDates,
              },
              layout: {
                defaultBorder: false,
              },
            },
          ],
        ],
      },
    });
  }
  cuadros[0].table.body.push([
    {
      text: `SEGUNDA PARTE`,
      fontSize: 7,
      bold: true,
      alignment: 'left',
      border: [true, false, true, true],
      colSpan: 2,
    },
    '',
  ]);

  return cuadros;
}

function createWhiteContainers(initRange: number, endRange: number) {
  const cuadros: ContentTable[] = [];
  for (let index = initRange; index <= endRange; index++) {
    cuadros.push({
      fontSize: 7,
      unbreakable: true,
      table: {
        dontBreakRows: true,
        widths: [360, '*'],
        body: [
          [
            {
              margin: [0, 10, 0, 0],
              text: `DESTINATARIO ${toOrdinal(index)} (NOMBRE Y CARGO):`.toUpperCase(),
              colSpan: 2,
              alignment: 'left',
              border: [true, false, true, false],
            },
            '',
          ],
          [
            {
              border: [true, false, false, false],
              table: {
                body: [
                  [
                    {
                      table: {
                        heights: 70,
                        widths: [70],
                        body: [
                          [
                            {
                              text: 'SELLO DE RECEPCION',
                              fontSize: 4,
                              alignment: 'center',
                            },
                          ],
                        ],
                      },
                    },
                    [{ text: 'INSTRUCCION / PROVEIDO' }, { text: ``, bold: true }],
                  ],
                ],
              },
              layout: {
                defaultBorder: false,
              },
            },
            {
              rowSpan: 1,
              border: [false, false, true, false],
              table: {
                widths: [100, 40],
                body: [
                  [
                    {
                      text: 'NRO. REGISTRO INTERNO (Correlativo)',
                      border: [false, false, false, false],
                    },
                    { text: `` },
                  ],
                  [
                    {
                      text: '\n\n\n\n-----------------------------------------',
                      colSpan: 2,
                      border: [false, false, false, false],
                      alignment: 'right',
                    },
                  ],
                  [
                    {
                      text: 'FIRMA Y SELLO',
                      colSpan: 2,
                      border: [false, false, false, false],
                      alignment: 'right',
                    },
                  ],
                ],
              },
            },
          ],
          [
            {
              colSpan: 2,
              border: [true, false, true, true],
              alignment: 'center',
              fontSize: 5,
              table: {
                widths: [30, 45, 35, '*', 30, 45, 35, '*'],
                body: [
                  [
                    '',
                    'FECHA',
                    'HORA',
                    'CANTIDAD DE HOJAS / ANEXOS',
                    '',
                    'FECHA',
                    'HORA',
                    'CANTIDAD DE HOJAS / ANEXOS',
                  ],
                  [
                    {
                      text: 'INGRESO',
                      border: [false, false, false, false],
                      fontSize: 7,
                    },
                    { text: ``, fontSize: 8, border: [true, true, true, true] },
                    { text: ``, fontSize: 8, border: [true, true, true, true] },
                    { text: ``, fontSize: 6, border: [true, true, true, true] },
                    {
                      text: 'SALIDA',
                      border: [false, false, false, false],
                      fontSize: 7,
                    },
                    { text: ``, border: [true, true, true, true], fontSize: 8 },
                    { text: ``, border: [true, true, true, true], fontSize: 8 },
                    { text: ``, border: [true, true, true, true], fontSize: 6 },
                  ],
                ],
              },
              layout: {
                defaultBorder: false,
              },
            },
          ],
        ],
      },
    });
  }
  if (initRange === 0) {
    cuadros[0].table.body.push([
      {
        text: `SEGUNDA PARTE`,
        fontSize: 7,
        bold: true,
        alignment: 'left',
        border: [true, false, true, true],
        colSpan: 2,
      },
      '',
    ]);
  }
  return cuadros;
}

export const RouteMapPdf = {
  CreateHeader,
  CreateFirstSection,
  CreateSecodSection,
};
