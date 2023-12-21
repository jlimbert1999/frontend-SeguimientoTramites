import { Component, Input, OnInit } from '@angular/core';
import { workflowResponse } from 'src/app/communication/interfaces';

@Component({
  selector: 'app-list-workflow',
  templateUrl: './list-workflow.component.html',
  styleUrls: ['./list-workflow.component.scss'],
})
export class ListWorkflowComponent implements OnInit {
  @Input() workflow: workflowResponse[] = [];
  @Input() startDate: Date;
  constructor() {}

  ngOnInit(): void {}
}
