import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-detalles-movilidad',
  templateUrl: './detalles-movilidad.component.html',
  styleUrls: ['./detalles-movilidad.component.css']
})
export class DetallesMovilidadComponent implements OnInit {
  Detalles: any[] = []
  folders: any[] = [
    {
      name: 'Photos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Work',
      updated: new Date('1/28/16'),
    },
  ];
  notes: any[] = [
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16'),
    },
  ];
  constructor(@Inject(MAT_DIALOG_DATA) public data: string, private userService: UsuariosService) { }

  ngOnInit(): void {
    this.userService.obtener_detalles_movilidad(this.data).subscribe(detalles => {
      this.Detalles = detalles
    })

  }

}
