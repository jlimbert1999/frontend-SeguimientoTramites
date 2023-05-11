import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _darkTheme = new Subject<boolean>();
  isDarkTheme = this._darkTheme.asObservable();
  constructor() { }
  activeDarkThem() {
    this._darkTheme.next(true);
  }
  desactiveDarkThem() {
    this._darkTheme.next(false);
  }
}
