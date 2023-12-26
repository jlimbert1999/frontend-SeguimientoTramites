import { Component, Input, OnInit } from '@angular/core';
import { workflowResponse } from 'src/app/communication/interfaces';
import { Workflow } from 'src/app/communication/models';

@Component({
  selector: 'app-list-workflow',
  templateUrl: './list-workflow.component.html',
  styleUrls: ['./list-workflow.component.scss'],
})
export class ListWorkflowComponent implements OnInit {
  @Input() workflow: Workflow[] = [];
  constructor() {}

  ngOnInit(): void {}
}
