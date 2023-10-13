import { Component } from '@angular/core';
import { ArchivoService } from '../../services/archivo.service';
import { communication } from 'src/app/communication/interfaces';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss'],
})
export class AdministrationComponent {
  displayedColumns: string[] = [
    'procedure',
    'manager',
    'reference',
    'date',
  ];
  dataSource: communication[] = [];
  constructor(private archiveService: ArchivoService) {
    this.archiveService.getAll(10, 0).subscribe((data) => {
      console.log(data);
      this.dataSource = data;
    });
  }
}
