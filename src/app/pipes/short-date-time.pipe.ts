import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'shortDateTime'
})
export class ShortDateTimePipe implements PipeTransform {

  transform (value: any): string {
    if (value == null) {
      return
    }
    // FIXME should use a localized format
    const dateAndTime = moment(value).format('DD/MM/YY HH:mm [hs.]')
    return dateAndTime
  }

}
