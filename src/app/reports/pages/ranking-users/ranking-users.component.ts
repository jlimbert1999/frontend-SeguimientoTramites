import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { TotalMailsUser } from '../../interfaces';

@Component({
  selector: 'app-ranking-users',
  templateUrl: './ranking-users.component.html',
  styleUrl: './ranking-users.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankingUsersComponent {
  datasource = signal<TotalMailsUser[]>([]);
  constructor(private reportService: ReportService) {
    this.reportService.getRankingUsers().subscribe((data) => {
      this.datasource.set(data);
    });
  }
}
