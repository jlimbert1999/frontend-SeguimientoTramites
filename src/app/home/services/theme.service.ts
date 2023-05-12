import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _darkTheme = new Subject<boolean>();
  isDarkTheme = this._darkTheme.asObservable();
  constructor(@Inject(DOCUMENT) private document: Document,) { }
  activeDarkThem() {
    this._darkTheme.next(true);
  }
  desactiveDarkThem() {
    this._darkTheme.next(false);
  }
  startDefaulTheme() {
    let theme = localStorage.getItem('theme')
    theme = theme ? theme : 'light-theme-a'
    this.setTheme(theme)

  }
  setTheme(nameTheme: string) {
    this.document.body.classList.remove(nameTheme)
    if (nameTheme === 'light-theme-a') {
      localStorage.removeItem('token');
      return
    }
    this.document.body.classList.add(nameTheme)
    localStorage.setItem('theme', nameTheme)
  }

}
