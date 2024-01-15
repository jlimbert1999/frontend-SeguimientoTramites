import { Pipe, type PipeTransform } from '@angular/core';
import { systemResource } from '../interfaces';

@Pipe({
  name: 'filterSystemResources',
})
export class FilterSystemRolesPipe implements PipeTransform {
  transform(systemResources: systemResource[], term: string): systemResource[] {
    if (term === '') return systemResources;
    return systemResources.filter((resource) => resource.label.toLowerCase().indexOf(term.toLowerCase()) > -1);
  }
}
