import { FormControl, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '../../services/report.service';
import { AlertService,PaginatorService} from 'src/app/shared/services';

@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickSearchComponent implements OnInit {
  public formSearch = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9-]*$')]);

  constructor(
    private router: Router,
    private reportService: ReportService,
    private paginatorService:PaginatorService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.formSearch.setValue(this.paginatorService.cache['code'] ?? '');
  }

  searchProcedure() {
    if (this.formSearch.invalid) return;
    this.alertService.showLoadingAlert('Buscando tramite...', 'Preparando vistas');
    this.reportService.searchProcedureByCode(this.formSearch.value!.toUpperCase()).subscribe((resp) => {
      this.alertService.closeLoadingAlert();
      const params = { search: true };
      this.paginatorService.cache['code'] = this.formSearch.value;
      this.router.navigate([`reportes/busqueda`, resp.group, resp._id], { queryParams: params });
    });
  }
}
