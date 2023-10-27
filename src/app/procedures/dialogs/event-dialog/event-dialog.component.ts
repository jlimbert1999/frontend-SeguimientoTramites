import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { eventProcedure } from '../../interfaces';
import { ArchiveService } from '../../services';
import { communication } from 'src/app/communication/interfaces';

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss'],
})
export class EventDialogComponent {
  events: eventProcedure[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: communication, private archiveService: ArchiveService) {
    this.getProcedureEvents();
  }
  getProcedureEvents() {
    this.archiveService.getEventsProcedure(this.data.procedure._id).subscribe((resp) => {
      this.events = resp;
    });
  }
}
