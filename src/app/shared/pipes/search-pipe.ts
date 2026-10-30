import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(arr: any[], searchTerm: string): any[] {
    return arr.filter(item => {
      // console.log(item.user.name)
      return item.user.name.includes(searchTerm.toLowerCase());
    });
  }
}
