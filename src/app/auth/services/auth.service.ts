import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import jwtDecode from 'jwt-decode';
import { account } from 'src/app/administration/interfaces';
import { jwtPayload, Menu } from '../interfaces';
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  account: jwtPayload;
  code: string;
  resources: string[];
  menu: Menu[] = [];
  constructor(private http: HttpClient, private router: Router) {}

  get token() {
    return localStorage.getItem('token') || '';
  }

  login(formData: { login: string; password: string }, remember: boolean) {
    remember ? localStorage.setItem('login', formData.login) : localStorage.removeItem('login');
    return this.http.post<{ token: string; resources: string[] }>(`${base_url}/auth`, formData).pipe(
      map((resp) => {
        localStorage.setItem('token', resp.token);
        this.account = jwtDecode(resp.token);
        this.resources = resp.resources;
        return resp.resources;
      })
    );
  }
  checkAuthStatus(): Observable<boolean> {
    return this.http
      .get<{
        token: string;
        resources: string[];
        code: string;
        menu: Menu[];
      }>(`${base_url}/auth`)
      .pipe(
        map((resp) => {
          this.account = jwtDecode(resp.token);
          this.resources = resp.resources;
          localStorage.setItem('token', resp.token);
          this.menu = resp.menu;
          return true;
        }),
        catchError((err) => {
          return of(false);
        })
      );
  }
  getMyAuthDetalis() {
    return this.http.get<account>(`${base_url}/auth/${this.account.id_account}`).pipe(map((resp) => resp));
  }
  updateMyAccount(password: string) {
    return this.http
      .put<account>(`${base_url}/auth/${this.account.id_account}`, {
        password,
      })
      .pipe(map((resp) => resp));
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
