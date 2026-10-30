import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trim',
})
export class TrimPipe implements PipeTransform {
  transform(text: string, limit:number = 3): string {
    return text.split('', limit).join('');
  }
}
