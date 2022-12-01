import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CuentaModel_view } from '../models/cuenta.mode';
import { UsuarioModel } from '../models/usuario.model';
import { CuentaService } from './cuenta.service';
import { PaginationService } from './pagination.service';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  termino_busqueda: string = ""
  busqueda: boolean = false
  constructor(private http: HttpClient, private paginationService: PaginationService, private cuentaService: CuentaService) { }
  agregar_funcionario(funcionario: UsuarioModel) {
    return this.http.post<{ ok: boolean, funcionario: UsuarioModel }>(`${base_url}/usuarios`, funcionario).pipe(
      map(resp => {
        this.cuentaService.dataSize += 1
        return resp.funcionario
      })
    )
  }
  agregar_multiples_funcionarios(funcionarios: UsuarioModel[]) {
    return this.http.post<{ ok: boolean, funcionarios: UsuarioModel }>(`${base_url}/usuarios/cargar`, { funcionarios }).pipe(
      map(resp => {
        return resp.funcionarios
      })
    )
  }

  obtener_funcionarios() {
    return this.http.get<{ ok: boolean, funcionarios: UsuarioModel[], total: number }>(`${base_url}/usuarios`).pipe(
      map(resp => {
        this.paginationService.dataSize = resp.total
        return resp.funcionarios
      })
    )
  }
  editar_funcionario(id_funcionario: string, funcionario: UsuarioModel) {
    return this.http.put<{ ok: boolean, funcionario: CuentaModel_view }>(`${base_url}/usuarios/${id_funcionario}`, funcionario).pipe(
      map(resp => resp.funcionario)
    )
  }
  buscar_usuarios() {
    this.termino_busqueda.trim().toLowerCase()
    return this.http.get<{ ok: boolean, funcionarios: UsuarioModel[], total: number }>(`${base_url}/usuarios/${this.termino_busqueda}`).pipe(
      map(resp => {
        this.paginationService.dataSize = resp.total
        return resp.funcionarios
      })
    )
  }

  cambiar_situacion(id_funcionario: string, activo: boolean) {
    activo = !activo
    return this.http.put<{ ok: boolean, funcionario: UsuarioModel }>(`${base_url}/usuarios/situacion/${id_funcionario}`, { activo }).pipe(
      map(resp => resp.funcionario)
    )
  }

  modo_busqueda(activar: boolean) {
    this.busqueda = activar
    this.paginationService.pageIndex = 0
    this.termino_busqueda = ""
  }

  obtener_detalles_movilidad(id_funcionario: string) {
    return this.http.get<{ ok: boolean, detalles: any }>(`${base_url}/usuarios/movilidad/${id_funcionario}`).pipe(
      map(resp => resp.detalles)
    )
  }

}
