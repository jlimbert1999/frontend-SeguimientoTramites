import { Component, Inject } from '@angular/core';
import { generateWhiteRoadMap } from 'src/app/Tramites/pdfs/whiteRoadMap';
import { ThemeService } from '../../services/theme.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.component.html',
  styleUrls: ['./recursos.component.scss']
})
export class RecursosComponent {
  numberRoadMaps = 9
  isDarkTheme = this.themService.isDarkTheme;
  check: boolean = false
  

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private themService: ThemeService) {
    this.numberRoadMaps = 9
  }
  formatLabel(value: number): string {
    return `${value}`;
  }
  generate() {
    generateWhiteRoadMap(this.numberRoadMaps)
  }
  toggleDarkTheme() {
    this.check = this.check!
    if (this.check) {
      this.document.body.classList.add('dark-theme')
    }
    else {
      this.document.body.classList.remove('dark-theme')
    }

  }

}
