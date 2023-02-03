import { Component, OnInit } from '@angular/core';
import { ExternosService } from '../../services/externos.service';

@Component({
  selector: 'app-concluidos',
  templateUrl: './concluidos.component.html',
  styleUrls: ['./concluidos.component.css']
})
export class ConcluidosComponent implements OnInit {

  constructor(private externoService: ExternosService) { }

  ngOnInit(): void {
    console.log('cambios')
    
  }

}
