import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SidenavService } from '../services/sidenav.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  @Input() search_mode: boolean
  @Input() title: string
  @Output() add = new EventEmitter();
  @Output() search = new EventEmitter()



  constructor(public sidenavService: SidenavService) {

  }

  call_Add() {
    this.add.emit()
  }
  call_search() {
    this.search.emit()
  }

  hideMenu() { 
    this.sidenavService.toggle();
  }
}
