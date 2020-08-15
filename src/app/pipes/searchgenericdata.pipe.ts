import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchgenericdata'
})
export class SearchgenericdataPipe implements PipeTransform {

  transform(items: any, term: string, attribute: string): any {
    if (items === null || items === undefined || term === undefined || term === null) {
      return items;
    }

    return items.filter(function (item) {
      return item[attribute].toLowerCase().includes(term.toLowerCase());
    });

  }

}
