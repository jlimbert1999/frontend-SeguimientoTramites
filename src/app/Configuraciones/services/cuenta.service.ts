import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CuentaModel, CuentaData } from '../models/cuenta.mode';
import { UsuarioModel } from '../models/usuario.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  public page: number = 0
  public rows: number = 10
  public dataSize: number = 0
  public busqueda: boolean = false
  public termino_busqueda: string

  constructor(private http: HttpClient) { }
  obtener_instituciones_hablitadas() {
    return this.http.get<{ ok: boolean, instituciones: { id_institucion: string, nombre: string }[] }>(`${base_url}/cuentas/instituciones`).pipe(
      map(resp => {
        return resp.instituciones
      })
    )
  }
  obtener_dependencias_hablitadas(id_institucion: string) {
    return this.http.get<{ ok: boolean, dependencias: { id_dependencia: string, nombre: string }[] }>(`${base_url}/cuentas/dependencias/${id_institucion}`).pipe(
      map(resp => {
        return resp.dependencias
      })
    )
  }
  obtener_funcionarios_asignacion() {
    return this.http.get<{ ok: boolean, funcionarios: { _id: string, nombre: string, cargo: string, dni: string }[] }>(`${base_url}/cuentas/usuarios`).pipe(
      map(resp => {
        return resp.funcionarios
      })
    )
  }

  agregar_cuenta(cuenta: CuentaModel, funcionario: UsuarioModel) {
    return this.http.post<{ ok: boolean, cuenta: CuentaData }>(`${base_url}/cuentas`, { cuenta, funcionario }).pipe(
      map(resp => {
        this.dataSize += 1
        return resp.cuenta
      })
    )
  }
  editar_cuenta(id_cuenta: string, cuenta: CuentaModel) {
    return this.http.put<{ ok: boolean, cuenta: CuentaModel }>(`${base_url}/cuentas/${id_cuenta}`, cuenta).pipe(
      map(resp => resp.cuenta)
    )
  }

  obtener_cuentas() {
    return this.http.get<{ ok: boolean, cuentas: CuentaData[], total: number }>(`${base_url}/cuentas?page=${this.page}&rows=${this.rows}`).pipe(
      map(resp => {
        this.dataSize = resp.total
        return resp.cuentas
      })
    )
  }
  buscar_cuenta() {
    return this.http.get<{ ok: boolean, cuentas: CuentaData[], total: number }>(`${base_url}/cuentas/busqueda/${this.termino_busqueda}?page=${this.page}&rows=${this.rows}`).pipe(
      map(resp => {
        this.dataSize = resp.total
        return resp.cuentas
      })
    )
  }

  asignar_cuenta(id_cuenta: string, id_funcionarioActual: string, id_funcionarioNuevo: string, newCuenta: { login: string, password: string }) {
    return this.http.put<{ ok: boolean, cuenta: CuentaData }>(`${base_url}/cuentas/asignar/${id_cuenta}`, { id_funcionarioActual, id_funcionarioNuevo, newCuenta }).pipe(
      map(resp => resp.cuenta)
    )
  }
  crear_cuenta_asignando(cuenta: CuentaModel) {
    return this.http.post<{ ok: boolean, cuenta: CuentaData }>(`${base_url}/cuentas/asignar`, cuenta).pipe(
      map(resp => resp.cuenta)
    )
  }

  modo_busqueda(activar: boolean) {
    this.busqueda = activar
    this.page = 0
    this.termino_busqueda = ''
  }

}
