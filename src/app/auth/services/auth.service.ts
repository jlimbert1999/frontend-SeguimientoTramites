import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { authStatus, jwtPayload, menu } from '../interfaces';
import { account } from 'src/app/administration/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly base_url: string = environment.base_url;
  private _account = signal<jwtPayload | undefined>(undefined);
  private _authStatus = signal<authStatus>(authStatus.notAuthenticated);
  private _menu = signal<menu[]>([]);

  public account = computed(() => this._account());
  public authStatus = computed(() => this._authStatus());
  public menu = computed(() => this._menu());

  constructor(private http: HttpClient, private router: Router) {}

  login(formData: { login: string; password: string }, remember: boolean) {
    remember ? localStorage.setItem('login', formData.login) : localStorage.removeItem('login');
    return this.http
      .post<{ token: string }>(`${this.base_url}/auth`, formData)
      .pipe(map(({ token }) => this.setAuthentication(token)));
  }

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }
    return this.http
      .get<{
        token: string;
        menu: menu[];
      }>(`${this.base_url}/auth`)
      .pipe(
        map(({ menu, token }) => {
          this._menu.set(menu);
          return this.setAuthentication(token);
        }),
        catchError(() => {
          this._authStatus.set(authStatus.notAuthenticated);
          return of(false);
        })
      );
  }
  getMyAccount() {
    return this.http.get<account>(`${this.base_url}/auth/${this.account()?.id_account}`);
  }
  updateMyAccount(password: string) {
    return this.http.put<{ message: string }>(`${this.base_url}/auth`, { password });
  }

  private setAuthentication(token: string): boolean {
    this._account.set(jwtDecode(token));
    this._authStatus.set(authStatus.authenticated);
    localStorage.setItem('token', token);
    return true;
  }

  logout() {
    localStorage.removeItem('token');
    this._authStatus.set(authStatus.notAuthenticated);
    this._account.set(undefined);
    this.router.navigate(['/login']);
  }
}
