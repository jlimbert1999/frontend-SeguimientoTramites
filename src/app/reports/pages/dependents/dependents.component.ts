import { Component, OnInit, signal } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { dependentDetails } from '../../interfaces';

@Component({
  selector: 'app-dependents',
  templateUrl: './dependents.component.html',
  styles: '',
})
export class DependentsComponent implements OnInit {
  dependents = signal<dependentDetails[]>([]);
  constructor(private reportService: ReportService) {}
  ngOnInit(): void {
    this.reportService.getDetailsDependentsByUnit().subscribe((resp) => {
      this.dependents.set(resp);
    });
  }
}
