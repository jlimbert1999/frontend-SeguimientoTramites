import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

import { Column, Content, TDocumentDefinitions, Table, TableCell } from 'pdfmake/interfaces';
import { FormatDate, convertImagenABase64 } from '../helpers';
import { ReportSheet } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class PdfGeneratorService {
  generateReportSheet({ title, datasource, displayColumns, fields }: ReportSheet) {
    const tableParams: Table = {
      widths: [100, '*'],
      headerRows: 1,
      body: [
        [{ text: 'PARAMETROS BUSQUEDA', bold: true, colSpan: 2 }, ''],
        ...Object.keys(fields).map((key) => {
          let text = key;
          if (key === 'code') text = 'ALTERNO';
          if (key === 'reference') text = 'REFERENCIA';
          return [{ text: text.toUpperCase(), bold: true }, fields[key]];
        }),
      ],
    };
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
      {
        table: tableParams,
        style: 'table',
        layout: 'lightHorizontalLines',
      },
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
}
