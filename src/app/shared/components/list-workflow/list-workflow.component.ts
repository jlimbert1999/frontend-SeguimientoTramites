import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { newWorkflow } from 'src/app/communication/interfaces/workflow.interface';



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
