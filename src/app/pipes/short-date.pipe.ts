import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'shortDate'
})
export class ShortDatePipe implements PipeTransform {

  transform (value: any): string {
    if (!value) {
      return
    }
    // FIXME should use a localized format
    if(typeof value === 'string'){
      const dateAndTime = moment(value.substring(0,value.indexOf('T'))).format('DD/MM/YY');//moment(value).format('DD/MM/YY')
      return dateAndTime
    } else {
      const dateAndTime = moment(value).format('DD/MM/YY');
      return dateAndTime
    }
  }

}
