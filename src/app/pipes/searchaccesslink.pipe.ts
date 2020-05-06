import { Injectable,Pipe,PipeTransform } from '@angular/core';

@Pipe({
  name:'searchaccesslink'
})
@Injectable()
export class SearchAccessLinkPipe implements PipeTransform
{
  transform(items:any,term:any):any
  {
    if(term === undefined || term===null)
    {
      return items;
    }

    return items.filter(function(item)
    {
       return item.title.toLowerCase().includes(term.toLowerCase());
    });

  }

}
