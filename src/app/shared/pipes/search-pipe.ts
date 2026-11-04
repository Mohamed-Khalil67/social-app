import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  // keeps the posts whose author's name or username contains the search term
  transform<T extends { user?: { name?: string; username?: string } }>(arr: T[] | null | undefined, searchTerm: string): T[] {
    if (!arr) return [];
    const term = searchTerm?.trim().toLowerCase();
    if (!term) return arr;

    return arr.filter(item => {
      const name = item.user?.name?.toLowerCase() ?? '';
      const username = item.user?.username?.toLowerCase() ?? '';
      return name.includes(term) || username.includes(term);
    });
  }
}
