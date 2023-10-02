import { Pipe, PipeTransform } from '@angular/core';
import { observation } from '../interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';

@Pipe({
  name: 'filterObservations',
})
export class FilterObservationsPipe implements PipeTransform {
  constructor(private readonly authService: AuthService) {}
  transform(observatios: observation[], filter: boolean): observation[] {
    if (!filter) return observatios;
    return observatios.filter(
      (observation) =>
        observation.account === this.authService.account.id_account
    );
  }
}
