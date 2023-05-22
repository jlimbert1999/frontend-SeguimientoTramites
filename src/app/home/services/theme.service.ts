import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(@Inject(DOCUMENT) private document: Document,) { }
  isDarkTheme(active: boolean) {
    if (active) {
      localStorage.setItem('theme', 'dark-theme')
      this.document.body.classList.add('dark-theme')
    }
    else {
      localStorage.removeItem('theme')
      this.document.body.classList.remove('dark-theme')
    }

  }

  startTheme() {
    const theme = localStorage.getItem('theme')
    theme ? this.document.body.classList.add(theme) : null
  }


}
