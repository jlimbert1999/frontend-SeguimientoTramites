import { Content, TableCell } from 'pdfmake/interfaces';
import { statusMail } from 'src/app/communication/interfaces';
import { Workflow } from 'src/app/communication/models';
import { stateProcedure } from 'src/app/procedures/interfaces';
import { ExternalProcedure, InternalProcedure, Procedure } from 'src/app/procedures/models';

function CreateSectionWorkflow(workflow: Workflow[]): Content {
  const body: TableCell[][] = workflow.map((el, index) => {
    const subTable: TableCell[][] = el.detail.map((send) => {
      return [
        { text: `${send.receiver.fullname} (${send.receiver.jobtitle})`, fontSize: 7 },
        [
          { text: `Referencia: ${send.reference}`, fontSize: 7 },
          ...(send.rejectionReason ? [{ text: `\nRechazo:: ${send.rejectionReason}` }] : []),
        ],
        [
          { text: `Fecha: ${send.inboundDate.fulldate}` },
          { text: `Cantidad: ${send.attachmentQuantity}` },
          { text: `Nro. Interno: ${send.internalNumber}` },
        ],
        CreateStatusSection(send.status),
      ];
    });
    return [
      { text: `${index + 1}`, alignment: 'center' },
      { text: `${el.emitter.fullname} (${el.emitter.jobtitle})` },
      { text: el.outboundDate.fulldate, alignment: 'center' },
      {
        table: {
          headerRows: 1,
          widths: [120, '*', 90, 45],
          body: [
            [
              { text: 'Funcionario', style: 'tableHeader' },
              { text: 'Referencia', style: 'tableHeader' },
              { text: 'Detalle', style: 'tableHeader' },
              { text: 'Status', style: 'tableHeader' },
            ],
            ...subTable,
          ],
        },
        layout: 'lightHorizontalLines',
      },
    ];
  });
  if (workflow.length === 0) body.push([{ text: 'SIN FLUJO DE TRABAJO', colSpan: 4 }]);
  return {
    pageBreak: 'before',
    pageOrientation: 'landscape',
    fontSize: 8,
    table: {
      headerRows: 1,
      widths: [30, 120, 45, '*'],
      body: [
        [
          { text: 'ETAPA', style: 'tableHeader' },
          { text: 'REMITENTE', style: 'tableHeader' },
          { text: 'FECHA', style: 'tableHeader' },
          { text: 'DESTINATARIOS', style: 'tableHeader' },
        ],
        ...body,
      ],
    },
  };
}
function CreateStatusSection(status: statusMail): Content {
  const properties: { label: string; color: string } = { label: 'Desconocido', color: 'purple' };
  switch (status) {
    case statusMail.Rejected:
      properties.color = 'red';
      properties.label = 'RECHAZADO';
      break;
    case statusMail.Pending:
      properties.color = 'orange';
      properties.label = 'PENDIENTE';
      break;
    case statusMail.Archived:
      properties.color = 'blue';
      properties.label = 'ARCHIVADO';
      break;
    default:
      properties.color = 'green';
      properties.label = 'RECIBIDO';
      break;
  }
  return { text: properties.label, color: properties.color, bold: true };
}
function CreateDetailSection(procedure: Procedure): Content {
  return [
    {
      fontSize: 10,
      table: {
        widths: [140, '*'],
        headerRows: 1,
        body: [
          [{ text: 'DETALLES DEL TRAMITE', bold: true, colSpan: 2 }, ''],
          [{ text: 'ALTERNO:' }, procedure.code],
          [{ text: 'REFERENCIA:' }, procedure.reference],
          [{ text: 'CANTIDAD:' }, procedure.amount],
          [{ text: 'ESTADO:' }, procedure.state],
          [{ text: 'REGISTRADO POR:' }, procedure.fullNameManager],
          [{ text: 'FECHA REGISTRO:' }, procedure.startDate.toLocaleString()],
          ...(procedure.state === stateProcedure.CONCLUIDO
            ? [
                [{ text: 'FECHA FINALIZACION:' }, procedure.endDate ? 'ds' : ''],
                [{ text: 'DURACION' }, procedure.getDuration()],
              ]
            : []),
        ],
      },
      layout: 'headerLineOnly',
    },
  ];
}
function CreateLocationSection(workflow: Workflow[]): Content {
  if (workflow.length === 0) return [];
  const location: TableCell[][] = [];
  workflow.forEach((stage) => {
    stage.detail.forEach((el) => {
      if (el.status === statusMail.Archived) {
        location.push([
          { text: `ARCHIVADO` },
          { text: `${el.receiver.fullname} (${el.receiver.jobtitle})` },
          { text: `Ingreso: ${el.inboundDate.fulldate}` },
        ]);
        return;
      }
      if (el.status === statusMail.Received) {
        location.push([
          { text: `EN BANDEJA` },
          { text: `${el.receiver.fullname} (${el.receiver.jobtitle})` },
          { text: `Ingreso: ${el.inboundDate.fulldate}` },
        ]);
        return;
      }
      if (el.status === statusMail.Pending) {
        location.push([
          { text: `EN PROCESO DE ENTREGA` },
          {
            text: `${stage.emitter.fullname} (${stage.emitter.jobtitle}) => ${el.receiver.fullname} (${el.receiver.jobtitle})`,
          },
          { text: `Fecha envio: ${stage.outboundDate.fulldate}` },
        ]);
        return;
      }
    });
  });
  if (location.length === 0) location.push([{ text: 'SIN REGISTRO', colSpan: 3 }]);
  return [
    { text: 'UBICACION TRAMITE', alignment: 'left', bold: true },
    {
      fontSize: 10,
      margin: [0, 5, 0, 20],
      table: {
        widths: [120, '*', 120],
        headerRows: 1,
        body: [
          [
            { text: 'DETALLE', bold: true },
            { text: 'PARTICIPANTE', bold: true },
            { text: 'FECHA', bold: true },
          ],
          ...location,
        ],
      },
    },
  ];
}
function CreateExternalSection(procedure: ExternalProcedure): Content {
  return [
    {
      columns: [
        {
          margin: [0, 20, 0, 20],
          width: 300,
          fontSize: 10,
          table: {
            widths: [65, 160],
            headerRows: 1,
            body: [
              [{ text: 'DETALLES DEL SOLICITANTE', bold: true, colSpan: 2 }, ''],
              [{ text: 'NOMBRE:' }, procedure.details.solicitante.nombre],
              ...(procedure.details.solicitante.tipo === 'NATURAL'
                ? [
                    [{ text: 'PATERNO:' }, procedure.details.solicitante.paterno ?? ''],
                    [{ text: 'MATERNO:' }, procedure.details.solicitante.materno ?? ''],
                    [{ text: 'DNI:' }, procedure.details.solicitante.dni ?? ''],
                    [{ text: 'DOCUMENTO:' }, procedure.details.solicitante.documento ?? ''],
                  ]
                : []),
              [{ text: 'TELEFONO:' }, procedure.details.solicitante.telefono],
            ],
          },
          layout: 'headerLineOnly',
        },
        {
          margin: [0, 20, 0, 20],
          width: 320,
          fontSize: 10,
          table: {
            widths: [65, 160],
            headerRows: 1,
            body: [
              [{ text: 'DETALLES DEL REPRESENTANTE', bold: true, colSpan: 2 }, ''],
              ...(procedure.details.representante
                ? [
                    [{ text: 'NOMBRE:' }, procedure.details.representante.nombre],
                    [{ text: 'PATERNO:' }, procedure.details.representante.paterno],
                    [{ text: 'MATERNO:' }, procedure.details.representante.materno],
                    [{ text: 'DNI:' }, procedure.details.representante.dni],
                    [{ text: 'DOCUMENTO:' }, procedure.details.representante.documento],
                    [{ text: 'TELEFONO:' }, procedure.details.representante.telefono],
                  ]
                : [[{ text: 'SIN REPRESENTANTE', colSpan: 2 }]]),
            ],
          },
          layout: 'headerLineOnly',
        },
      ],
    },
    { text: 'REQUERIMIENTOS PRESENTADOS\n\n', bold: true },
    {
      ul: procedure.details.requirements.length > 0 ? [procedure.details.requirements] : ['SIN REQUERIMIENTOS'],
    },
  ];
}
function CreateInternalSection(procedure: InternalProcedure): Content {
  return [
    {
      columns: [
        {
          margin: [0, 20, 0, 20],
          width: 300,
          fontSize: 10,
          table: {
            widths: [60, 160],
            headerRows: 1,
            body: [
              [{ text: 'DETALLES DEL REMITENTE', bold: true, colSpan: 2 }, ''],
              [{ text: 'NOMBRE:' }, procedure.details.remitente.nombre],
              [{ text: 'CARGO:' }, procedure.details.remitente.cargo],
            ],
          },
          layout: 'headerLineOnly',
        },
        {
          margin: [0, 20, 0, 20],
          width: 300,
          fontSize: 10,
          table: {
            widths: [60, 160],
            headerRows: 1,
            body: [
              [{ text: 'DETALLES DEL DESTINATARIO', bold: true, colSpan: 2 }, ''],
              [{ text: 'NOMBRE:' }, procedure.details.destinatario.nombre],
              [{ text: 'CARGO:' }, procedure.details.destinatario.cargo],
            ],
          },
          layout: 'headerLineOnly',
        },
      ],
    },
  ];
}

export const IndexCard = {
  CreateDetailSection,
  CreateSectionWorkflow,
  CreateLocationSection,
  CreateExternalSection,
  CreateInternalSection,
};
