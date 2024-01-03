import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

import { Content, PageOrientation, TDocumentDefinitions, Table, TableCell } from 'pdfmake/interfaces';
import { convertImagenABase64, RouteMapPdf, IndexCard } from '../helpers';
import { ReportSheet } from '../interfaces';
import { ExternalProcedure, InternalProcedure, Procedure } from 'src/app/procedures/models';
import { groupProcedure, stateProcedure } from 'src/app/procedures/interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Workflow } from 'src/app/communication/models';
import { statusMail } from 'src/app/communication/interfaces';

interface ReportSheetProps {
  title: string;
  subtitle: string;
  content: Content[];
  orientation?: PageOrientation;
}

@Injectable({
  providedIn: 'root',
})
export class PdfGeneratorService {
  constructor(private readonly authService: AuthService) {}

  async generateRouteSheet(procedure: Procedure, workflow: Workflow[]) {
    workflow = workflow
      .map((communication) => {
        const { detail, ...values } = communication;
        const filteredItems = detail.filter((send) => send.status !== statusMail.Rejected);
        return { detail: filteredItems, ...values };
      })
      .filter((elemet) => elemet.detail.length > 0);
    const docDefinition: TDocumentDefinitions = {
      pageSize: 'LETTER',
      pageMargins: [30, 30, 30, 30],
      content: [
        await RouteMapPdf.CreateHeader(),
        RouteMapPdf.CreateFirstSection(procedure, workflow[0]),
        RouteMapPdf.CreateSecodSection(workflow),
      ],
      footer: {
        margin: [10, 0, 10, 0],
        fontSize: 7,
        pageBreak: 'after',
        text: [
          {
            text: 'NOTA: Esta hoja de ruta de correspondencia, no debera ser separada ni extraviada del documento del cual se encuentra adherida, por constituirse parte indivisible del mismo',
            bold: true,
          },
          {
            text: '\nDireccion: Plaza 6 de agosto E-0415 - Telefono: No. Piloto 4701677 - 4702301 - 4703059 - Fax interno: 143',
            color: '#BC6C25',
          },
          {
            text: '\nE-mail: info@sacaba.gob.bo - Pagina web: www.sacaba.gob.bo',
            color: '#BC6C25',
          },
        ],
      },
      styles: {
        cabecera: {
          margin: [0, 0, 0, 10],
        },
        header: {
          fontSize: 10,
          bold: true,
        },
        tableExample: {
          fontSize: 8,
          alignment: 'center',
          margin: [0, 0, 0, 5],
        },
        selection_container: {
          fontSize: 7,
          alignment: 'center',
          margin: [0, 10, 0, 0],
        },
      },
    };
    pdfMake.createPdf(docDefinition).print();
  }

  generateReportSheet({ title, datasource, displayColumns, subtitle }: ReportSheet) {
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
            if (columnDef === 'date') return { text: new Date(procedure.date).toLocaleString() };
            return { text: procedure[columnDef] };
          })
        ),
      ],
    };
    this.GenerateReportSheet({
      title,
      subtitle: subtitle ?? '',
      orientation: 'landscape',
      content: [{ table: tableResults, style: 'table', layout: 'lightHorizontalLines', fontSize: 8 }],
    });
  }

  async GenerateIndexCard(procedure: ExternalProcedure | InternalProcedure, workflow: Workflow[]) {
    await this.GenerateReportSheet({
      title: `FICHA DE TRAMITE ${procedure.group === groupProcedure.EXTERNAL ? 'EXTERNO' : 'INTERNO'}`,
      subtitle: procedure.code,
      content: [
        IndexCard.CreateLocationSection(workflow),
        IndexCard.CreateDetailSection(procedure),
        ...(procedure.group === groupProcedure.EXTERNAL
          ? [IndexCard.CreateExternalSection(procedure as ExternalProcedure)]
          : [IndexCard.CreateInternalSection(procedure as InternalProcedure)]),
        IndexCard.CreateSectionWorkflow(workflow),
      ],
    });
  }

  private async GenerateReportSheet({ title, subtitle, content, orientation = 'portrait' }: ReportSheetProps) {
    const docDefinition: TDocumentDefinitions = {
      header: {
        columns: [
          { width: 90, image: await convertImagenABase64('../../../assets/img/logo_alcaldia.png') },
          {
            width: '*',
            text: [`\n${title}`, { text: `\n${subtitle}`, fontSize: 12 }],
            bold: true,
            fontSize: 16,
          },
          {
            width: 100,
            text: `${new Date().toLocaleString()}`,
            fontSize: 10,
            bold: true,
            alignment: 'left',
          },
        ],
        alignment: 'center',
        margin: [10, 10, 10, 10],
      },
      footer: {
        margin: [10, 0, 10, 0],
        fontSize: 8,
        text: `Generado por: ${this.authService.account()?.officer.fullname} (${
          this.authService.account()?.officer.jobtitle
        })`,
      },
      pageSize: 'LETTER',
      pageMargins: [30, 110, 40, 30],
      content: content,
      pageOrientation: orientation,
      styles: {
        table: {
          marginTop: 20,
        },
        tableHeader: {
          fillColor: '#0077B6',
          color: 'white',
          bold: true,
          fontSize: 9,
          alignment: 'center',
        },
      },
    };
    pdfMake.createPdf(docDefinition).print();
  }
}
