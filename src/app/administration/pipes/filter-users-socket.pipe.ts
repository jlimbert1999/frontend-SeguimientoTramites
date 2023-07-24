import { Pipe, PipeTransform } from '@angular/core';
import { userSocket } from 'src/app/auth/models/account.model';

@Pipe({
  name: 'filterUsersSocket'
})
export class FilterUsersSocketPipe implements PipeTransform {

  transform(users: userSocket[] | null, textSearch: string): userSocket[] {
    if (!users) return []
    if (!textSearch || textSearch === '') {
      return users;
    }
    return users.filter(user => user.officer.fullname.toLowerCase().includes(textSearch.toLowerCase()) || user.officer.jobtitle.toLowerCase().includes(textSearch.toLowerCase()));
  }

}
