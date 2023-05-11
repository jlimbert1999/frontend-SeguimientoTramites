import { Component } from '@angular/core';
import { generateWhiteRoadMap } from 'src/app/Tramites/pdfs/whiteRoadMap';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.component.html',
  styleUrls: ['./recursos.component.scss']
})
export class RecursosComponent {
  numberRoadMaps = 9
  isDarkTheme = this.themService.isDarkTheme;
  check: boolean
  constructor(private themService: ThemeService) {
    this.numberRoadMaps = 9
  }
  formatLabel(value: number): string {
    return `${value}`;
  }
  generate() {
    generateWhiteRoadMap(this.numberRoadMaps)
  }
  toggleDarkTheme() {
    this.check ? this.themService.activeDarkThem() : this.themService.desactiveDarkThem()
  }
}
