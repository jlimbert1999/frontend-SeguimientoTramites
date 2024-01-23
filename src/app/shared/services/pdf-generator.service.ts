import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

import { Content, PageOrientation, TDocumentDefinitions, Table } from 'pdfmake/interfaces';
import { convertImagenABase64, RouteMapPdf, IndexCard, UnlinkSheet } from '../helpers';
import { ReportSheet } from '../interfaces';
import { ExternalProcedure, InternalProcedure, Procedure } from 'src/app/procedures/models';
import { groupProcedure } from 'src/app/procedures/interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Workflow } from 'src/app/communication/models';
import { communicationResponse, statusMail } from 'src/app/communication/interfaces';
import { account } from 'src/app/administration/interfaces';
import { AccountSheet, ApprovedSheet } from '../helpers/pdf';
import { Account } from 'src/app/administration/models';

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
      .map(({ detail, ...values }) => {
        const filteredItems = detail.filter((send) => send.status !== statusMail.Rejected);
        return { ...values, detail: filteredItems };
      })
      .filter((element) => element.detail.length > 0);
    const index = workflow.findIndex((element) => element.detail.length > 1);
    const filteredWorkflow = index !== -1 ? workflow.slice(0, index + 1) : workflow;

    const docDefinition: TDocumentDefinitions = {
      pageSize: 'LETTER',
      pageMargins: [30, 30, 30, 30],
      content: [
        await RouteMapPdf.CreateHeader(),
        RouteMapPdf.CreateFirstSection(procedure, workflow[0]),
        RouteMapPdf.CreateSecodSection(filteredWorkflow),
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
  async GenerateUnlinkSheet(data: communicationResponse[], account: account) {
    const date = new Date();
    const docDefinition: TDocumentDefinitions = {
      pageSize: 'LETTER',
      content: [
        await ApprovedSheet.createHeader({
          code: 'SF-000-74-RG31',
          title: 'SOLICITUD DE BAJA DE USUARIO DE SISTEMA DE SEGUIMIENTO DE TRAMITES',
          date: '20/06/2023',
        }),
        UnlinkSheet.CreateSectionDetails(account, date, data),
        UnlinkSheet.CreateSectionList(data, date),
      ],
      footer: function (currentPage, pageCount) {
        if (currentPage === 1)
          return [
            {
              margin: [10, 0, 10, 0],
              fontSize: 8,
              text: 'Este formulario no exime que a futuro se solicite al servidor(a) público información respecto a trámites o procesos que hubieran estado a su cargo hasta el último día laboral en la Entidad, también NO impide ni se constituye en prueba para ninguna Auditoria u otros.',
            },
          ];
        currentPage--;
        pageCount--;
        return [
          {
            margin: [0, 20, 20, 0],
            fontSize: 9,
            text: {
              text: 'Pagina ' + currentPage.toString() + ' de ' + pageCount,
              alignment: 'right',
            },
          },
        ];
      },
    };
    pdfMake.createPdf(docDefinition).print();
  }

  async createAccountSheet(account: Account, password: string) {
    const docDefinition: TDocumentDefinitions = {
      pageSize: 'LETTER',
      pageMargins: [40, 40, 40, 40],
      content: [
        await ApprovedSheet.createHeader({
          title: 'ASIGNACION DE USUARIO DE SISTEMA DE SEGUIMIENTO DE TRAMITES INTERNOS Y EXTERNOS',
          code: 'SF-000-74-RG26',
          date: '20/02/2020',
        }),
        AccountSheet.createContent(account, password),
      ],
    };
    pdfMake.createPdf(docDefinition).print();
  }
}
