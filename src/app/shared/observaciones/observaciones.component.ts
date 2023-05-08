import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BandejaEntradaService } from 'src/app/Bandejas/services/bandeja-entrada.service';
import { Observacion } from 'src/app/Tramites/models/Externo.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-observaciones',
  templateUrl: './observaciones.component.html',
  styleUrls: ['./observaciones.component.css']
})
export class ObservacionesComponent implements OnInit {
  @Input() Observaciones: Observacion[] = []
  @Input() Options: boolean
  @Output() setNewState = new EventEmitter<string>();
  filter: boolean = false

  constructor(
    public authService: AuthService,
    private entradaService: BandejaEntradaService
  ) { }

  ngOnInit(): void {

  }

  markAsSolved(observation: Observacion) {
    Swal.fire({
      title: `Marcar la observacion como corregida?`,
      text: `Esta observacion se mostrara como corregida para todos los funcionarios`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.entradaService.repairObservation(observation._id).subscribe(state => {
          const index = this.Observaciones.findIndex(obs => obs._id === observation._id)
          this.Observaciones[index].solved = true
          this.setNewState.emit(state)
        })
      }
    })
  }

  filterObservation() {
    return this.filter === true
      ? this.Observaciones.filter(obs => obs.account === this.authService.account.id_account)
      : this.Observaciones
  }
  




}
