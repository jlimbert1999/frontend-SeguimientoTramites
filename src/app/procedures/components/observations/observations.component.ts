import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InboxService } from 'src/app/communication/services/inbox.service';
import { observation } from 'src/app/procedures/interfaces';

@Component({
  selector: 'app-observations',
  templateUrl: './observations.component.html',
  styleUrls: ['./observations.component.scss'],
})
export class ObservationsComponent implements OnInit {
  @Input() observations: observation[] = [];
  @Output() setNewState = new EventEmitter<string>();
  filter: boolean = false;

  constructor(
    public authService: AuthService,
    private entradaService: InboxService
  ) {}

  ngOnInit(): void {}

  markAsSolved(observation: any) {
    // Swal.fire({
    //   title: `Marcar la observacion como corregida?`,
    //   text: `Esta observacion se mostrara como corregida para todos los funcionarios`,
    //   icon: 'question',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Aceptar',
    //   cancelButtonText: 'Cancelar',
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     this.entradaService
    //       .repairObservation(observation._id)
    //       .subscribe((state) => {
    //         const index = this.Observaciones.findIndex(
    //           (obs) => obs._id === observation._id
    //         );
    //         this.Observaciones[index].solved = true;
    //         this.setNewState.emit(state);
    //       });
    //   }
    // });
  }

  filterObservation() {
    // return this.filter === true
    //   ? this.Observaciones.filter(
    //       (obs) => obs.account === this.authService.account.id_account
    //     )
    //   : this.Observaciones;
  }
}
