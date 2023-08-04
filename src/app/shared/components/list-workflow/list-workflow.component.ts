import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { createListWorkflow } from 'src/app/Bandejas/helpers/ListWorkflow';
import { newWorkflow } from 'src/app/Bandejas/interfaces/workflow.interface';
import { ListWorkflow, WorkflowData } from 'src/app/Bandejas/models/workflow.interface';



@Component({
  selector: 'app-list-workflow',
  templateUrl: './list-workflow.component.html',
  styleUrls: ['./list-workflow.component.scss']
})
export class ListWorkflowComponent implements OnInit {
  @Input() workflow: newWorkflow[] = []
  @Input() fecha_registro: string
  constructor() { }

  ngOnInit(): void {
  }


}
