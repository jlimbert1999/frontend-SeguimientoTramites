import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mail-header',
  templateUrl: './mail-header.component.html',
  styleUrls: ['./mail-header.component.scss']
})
export class MailHeaderComponent implements OnInit {
  @Input() Data: any
  constructor() { }

  ngOnInit(): void {
  
  }

}
