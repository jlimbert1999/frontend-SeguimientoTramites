import { Component, OnInit, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data:
    {
      _id: string,
      dependencia: {
        nombre: string
        sigla: string
        institucion: {
          sigla: string
        }
      },
      funcionario: {
        nombre: string
        paterno: string
        materno: string
        cargo: string
        nombre_completo?: string
      }
    }) { }

  ngOnInit(): void {
    this.data.funcionario.nombre_completo = `${this.data.funcionario.nombre} ${this.data.funcionario.paterno} ${this.data.funcionario.materno}`.toUpperCase()
  }

}
