import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Input() title: string

  @Input() showAdd: boolean = false
  @Output() add = new EventEmitter();

  @Input() showPDF: boolean = false
  @Output() pdf = new EventEmitter();


 


  constructor() {
  }

  call_Add() {
    this.add.emit()
  }

  call_pdf() {
    this.pdf.emit()
  }

  hideMenu() {

  }
}
