import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

import { Column, Content, TDocumentDefinitions, Table, TableCell } from 'pdfmake/interfaces';
import { FormatDate, convertImagenABase64 } from '../helpers';
import { ReportSheet } from '../interfaces';
import { Procedure } from 'src/app/procedures/models';
import { groupProcedure, stateProcedure } from 'src/app/procedures/interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Workflow } from 'src/app/communication/models';

@Injectable({
  providedIn: 'root',
})
export class PdfGeneratorService {
  constructor(private readonly authService: AuthService) {}
  generateReportSheet({ title, datasource, displayColumns }: ReportSheet) {
    const tableResults: Table = {
      headerRows: 1,
      dontBreakRows: true,
      widths: displayColumns.map(({ columnDef }) => {
        if (columnDef === 'code' || columnDef === 'date') return 100;
        if (columnDef === 'state') return 60;
        if (columnDef === 'reference') return 300;
        return '*';
      }),
      body: [
        displayColumns.map((colum) => ({ text: colum.header.toUpperCase(), bold: true, style: 'tableHeader' })),
        ...datasource.map((procedure) =>
          displayColumns.map(({ columnDef }) => {
            if (columnDef === 'date') return { text: FormatDate(procedure.date) };
            return { text: procedure[columnDef] };
          })
        ),
      ],
    };
    const content: Content[] = [
      { text: title, alignment: 'center', bold: true },
      { table: tableResults, style: 'table', layout: 'lightHorizontalLines', fontSize: 8 },
    ];
    const docDefinition: TDocumentDefinitions = {
      header: {
        text: `FECHA: ${FormatDate(`${new Date()}`)}`,
        alignment: 'right',
        margin: [0, 10, 40, 0],
      },
      pageSize: 'LETTER',
      pageOrientation: 'landscape',
      content: content,
      styles: {
        table: {
          marginTop: 20,
        },
        tableHeader: {
          fillColor: '#0077B6',
          color: 'white',
          fontSize: 9,
        },
      },
    };
    pdfMake.createPdf(docDefinition).print();
  }

  async generateFicha(procedure: Procedure, workflow: Workflow) {
    const docDefinition: TDocumentDefinitions = {
      header: {
        columns: [
          { width: 90, image: await convertImagenABase64('../../../assets/img/logo_alcaldia.png') },
          {
            width: '*',
            text: [
              `\nFICHA DE TRAMITE ${procedure.group === groupProcedure.EXTERNAL ? 'EXTERNO' : 'INTERNO'}\n`,
              { text: `FECHA: ${FormatDate(`${new Date()}`)}`, fontSize: 12 },
            ],
            bold: true,
            fontSize: 16,
          },
          {
            width: 100,
            text: `Generado por: ${this.authService.account()?.officer.fullname} (${
              this.authService.account()?.officer.jobtitle
            })`,
            fontSize: 8,
            alignment: 'left',
          },
        ],
        alignment: 'center',
        margin: [10, 10, 10, 10],
      },
      pageSize: 'LETTER',
      pageMargins: [50, 110, 50, 50],
      content: [
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
        this.sectionWorkflow(workflow),
      ],
      styles: {
        table: {
          marginTop: 20,
        },
        tableHeader: {
          fillColor: '#0077B6',
          color: 'white',
          fontSize: 9,
        },
      },
    };
    pdfMake.createPdf(docDefinition).print();
  }

  private sectionWorkflow(workflow: Workflow): Content {
    const body: TableCell[][] = workflow.stages.map((el) => {
      const subTable: TableCell[][] = el.sends.map((send) => {
        return [send.emitter.fullname];
      });
      return [
        { text: el.id_emitter },
        {
          table: {
            body: subTable,
          },
        },
      ];
    });
    return {
      pageBreak: 'before',
      pageOrientation: 'landscape',
      table: {
        body: body,
      },
    };
  }
}
