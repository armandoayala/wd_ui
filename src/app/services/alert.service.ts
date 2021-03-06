import { Injectable } from '@angular/core';

//Models
import { Alert } from '../models/ui/alertui';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alert:Alert;

  constructor() { }

  showAlert(pAlert)
  {
   this.alert=pAlert;
   window.scroll(0,0);
  }

  destroyAlert()
  {
   this.alert=null;
  }

  getAlert()
  {
   return this.alert;
  }

}
