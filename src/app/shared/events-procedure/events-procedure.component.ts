import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-events-procedure',
  templateUrl: './events-procedure.component.html',
  styleUrls: ['./events-procedure.component.css']
})
export class EventsProcedureComponent implements OnInit {

  @Input() events: any[] = []

  ngOnInit(): void {
   
   
  }

}
