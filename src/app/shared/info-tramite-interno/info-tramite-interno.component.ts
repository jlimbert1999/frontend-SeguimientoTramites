import { Component, Input } from '@angular/core';
import { Interno } from 'src/app/Internos/models/Interno.interface';

@Component({
  selector: 'app-info-tramite-interno',
  templateUrl: './info-tramite-interno.component.html',
  styleUrls: ['./info-tramite-interno.component.css']
})
export class InfoTramiteInternoComponent {
  @Input() Tramite: Interno
  timer: any;
  count: any

}
