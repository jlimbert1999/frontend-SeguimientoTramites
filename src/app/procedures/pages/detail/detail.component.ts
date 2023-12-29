import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PdfGeneratorService, PaginatorService } from 'src/app/shared/services';
import { Workflow } from 'src/app/communication/models';
import { ExternalProcedure, InternalProcedure } from '../../models';
import { ProcedureService } from '../../services/procedure.service';
import { groupProcedure, observation } from '../../interfaces';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailComponent implements OnInit {
  procedure = signal<InternalProcedure | ExternalProcedure | null>(null);
  workflow: Workflow[] = [];
  observations: observation[] = [];

  constructor(
    private route: ActivatedRoute,
    private paginatorService: PaginatorService,
    private procedureService: ProcedureService,
    private pdfService: PdfGeneratorService,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ group, id }) => {
      if (!Object.values(groupProcedure).includes(group) || !id) {
        this._location.back();
        return;
      }
      this.getProcedure(id, group);
    });
  }
  getProcedure(id: string, group: groupProcedure) {
    this.procedureService.getFullProcedure(id, group).subscribe((data) => {
      this.procedure.set(data.procedure);
      this.workflow = data.workflow;
      this.observations = data.observations;
    });
  }

  backLocation() {
    this.route.queryParams.subscribe((data) => {
      this.paginatorService.limit = data['limit'] ?? 10;
      this.paginatorService.offset = data['offset'] ?? 0;
      this.paginatorService.searchMode.set(String(data['search']).toLowerCase() === 'true' ? true : false);
      this._location.back();
    });
  }

  generateFicha() {
    this.pdfService.generateFicha(this.procedure()!, this.workflow);
  }
  get external() {
    return this.procedure() as ExternalProcedure;
  }
  get internal() {
    return this.procedure() as InternalProcedure;
  }
  get group() {
    return groupProcedure;
  }
}
