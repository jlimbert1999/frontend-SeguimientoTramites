import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class PerfilService {


  constructor(private http: HttpClient) { }

  getDetailsAccount() {
    return this.http.get<{ ok: boolean, cuenta: any }>(`${base_url}/perfil`).pipe(
      map(resp => {
        resp.cuenta.funcionario['nombre_completo'] = `${resp.cuenta.funcionario.nombre} ${resp.cuenta.funcionario.paterno} ${resp.cuenta.funcionario.materno}`
        return resp.cuenta
      })
    )
  }
  editAccount(login: string, password?: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/perfil`, { login, password }).pipe(
      map(resp => resp.message)
    )
  }
}
