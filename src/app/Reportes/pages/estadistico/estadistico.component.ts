import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ReporteEstadisticoService } from '../../services/reporte-estadistico.service';
import { LegendPosition } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-estadistico',
  templateUrl: './estadistico.component.html',
  styleUrls: ['./estadistico.component.css']
})
export class EstadisticoComponent implements OnInit {
  view: any = [700, 400];

  // options
  gradient: boolean = false;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: LegendPosition = LegendPosition.Right


  data_externos: any[] = []
  data_internos: any[] = []


  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Externos', cols: 2, rows: 1, section: 'externos' },
          { title: 'Internos', cols: 2, rows: 1, section: 'internos' },
          { title: 'Card 3', cols: 1, rows: 1, section: '' },
          { title: 'Card 4', cols: 1, rows: 1, section: '' }
        ];
      }

      return [
        { title: 'Externos', cols: 1, rows: 1, section: 'externos' },
        { title: 'Internos', cols: 1, rows: 1, section: 'internos' },
        { title: 'Card 3', cols: 1, rows: 2, section: '' },
        { title: 'Card 4', cols: 1, rows: 1, section: '' }
      ];
    })
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private reporteService: ReporteEstadisticoService
  ) {
  }
  ngOnInit(): void {
    this.reporteService.getInfoInstituciones().subscribe(data => {
      data.forEach(info => {
        this.data_externos.push({ name: info.name, value: info.cantidad_externos })
        this.data_internos.push({ name: info.name, value: info.cantidad_internos })

      })
    })
  }



}
