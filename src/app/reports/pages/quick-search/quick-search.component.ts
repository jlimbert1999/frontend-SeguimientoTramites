import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { AlertManager } from 'src/app/shared/helpers/alerts';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.scss'],
})
export class QuickSearchComponent {
  router = inject(Router);
  reportService = inject(ReportService);
  formSearch = new FormControl('', [Validators.required]);

  searchProcedure() {
    if (this.formSearch.invalid) return;
    AlertManager.showLoadingAlert('Buscando tramite.....', 'Preparando vistas');
    this.reportService.searchProcedureByCode(this.formSearch.value!).subscribe((resp) => {
      AlertManager.closeLoadingAlert();
      this.router.navigate([`reportes`, 'busqueda', 'externos', resp._id]);
    });
  }
}
