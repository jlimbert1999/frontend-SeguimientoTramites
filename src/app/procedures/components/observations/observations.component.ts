import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { observation } from 'src/app/procedures/interfaces';

@Component({
  selector: 'app-observations',
  templateUrl: './observations.component.html',
  styleUrls: ['./observations.component.scss'],
})
export class ObservationsComponent implements OnInit {
  @Input() observations: observation[] = [];
  @Input() enableOptions: boolean = false;
  @Output() solveObservation = new EventEmitter<string>();
  filter: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  markAsSolved(observation: observation) {
    this.solveObservation.emit(observation._id);
  }

  get id_account() {
    return this.authService.account()?.id_account;
  }
}
