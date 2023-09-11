import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { workflow } from 'src/app/communication/interfaces';

@Component({
  selector: 'app-list-workflow',
  templateUrl: './list-workflow.component.html',
  styleUrls: ['./list-workflow.component.scss'],
})
export class ListWorkflowComponent implements OnInit {
  @Input() workflow: workflow[] = [];
  @Input() startDate: Date;
  constructor() {}

  ngOnInit(): void {}
}
