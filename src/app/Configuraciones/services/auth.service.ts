import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  Menu = [
   
    {
      modulo: "Configuraciones",
      submodulos: [
        { nombre: 'Administrar instituciones', ruta: 'instituciones', icon: 'group' },
        { nombre: 'Administrar dependencias', ruta: 'dependencias', icon: 'group' },

      ]
      
    },
    
    {
      modulo: "Usuarios",
      submodulos: [
        { nombre: 'Administrar funcionarios', ruta: 'funcionarios', icon: 'group' },
        { nombre: 'Administrar cuentas', ruta: 'cuentas', icon: 'group' },
      ]
      
    }
  ]

  constructor() { }
}
