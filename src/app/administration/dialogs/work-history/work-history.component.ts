import { ChangeDetectionStrategy, Component, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuariosService } from '../../services/usuarios.service';
import { workHistoryResponse, officer } from '../../interfaces';

@Component({
  selector: 'app-work-history',
  templateUrl: './work-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkHistoryComponent implements OnInit {
  isLoading = signal<boolean>(true);
  history = signal<workHistoryResponse[]>([]);
  constructor(private officerService: UsuariosService, @Inject(MAT_DIALOG_DATA) public officer: officer) {}
  ngOnInit(): void {
    this.officerService.getWorkHistory(this.officer._id, 0).subscribe((data) => {
      this.history.set(data);
      this.isLoading.set(false);
    });
  }
}
