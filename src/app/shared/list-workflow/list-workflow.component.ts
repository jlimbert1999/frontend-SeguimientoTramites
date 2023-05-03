import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import * as moment from 'moment';
import { createListWorkflow } from 'src/app/Bandejas/helpers/ListWorkflow';
import { ListWorkflow, WorkflowData } from 'src/app/Bandejas/models/workflow.interface';

@Component({
  selector: 'app-list-workflow',
  templateUrl: './list-workflow.component.html',
  styleUrls: ['./list-workflow.component.css']
})
export class ListWorkflowComponent implements OnInit {
  @Input() Workflow: WorkflowData[] = []
  @Input() fecha_registro: string
  ListWorflow: ListWorkflow[] = []
  constructor() { }

  ngOnInit(): void {
    this.ListWorflow = createListWorkflow(this.Workflow, [{ id_root: this.Workflow[0].emisor.cuenta._id, startDate: this.fecha_registro }], [])
  }

}
