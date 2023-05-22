import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'badge'
})
export class BadgePipe implements PipeTransform {

  transform(value: number): string {

    let exp, suffixes = ['k', 'M', 'G', 'T', 'P', 'E'];
    if (isNaN(value)) {
      return '?';
    }
    if (value < 1000) {
      return value.toString();
    }
    return Math.round(value / 1000) + "k";
  }

}
