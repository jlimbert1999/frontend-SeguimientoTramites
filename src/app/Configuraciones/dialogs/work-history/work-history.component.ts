import { Component, Inject, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { officer } from '../../interfaces/oficer.interface';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { workHistory } from '../../interfaces/workHistory.interface';

@Component({
  selector: 'app-work-history',
  templateUrl: './work-history.component.html',
  styleUrls: ['./work-history.component.scss']
})
export class WorkHistoryComponent implements OnInit {
  history: workHistory[] = []
  constructor(
    private officerService: UsuariosService,
    @Inject(MAT_DIALOG_DATA) public officer: officer
  ) {

  }
  ngOnInit(): void {
    this.officerService.getWorkHistory(this.officer._id, 100, 0).subscribe(data => {
      this.history = data
    })
   
  }


}
