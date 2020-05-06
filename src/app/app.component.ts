import { Component, DoCheck, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

//Services
import { UserService } from './services/user.service';
import { AlertService } from './services/alert.service';

//Models
import {User} from './models/user';
import {Alert} from './models/ui/alertui';

interface AppAlert {
  alert: Alert;
  show: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,DoCheck{

  public title: string;
  public identity: User;
  public appAlert:AppAlert;

  constructor(
    private _userService:UserService,
    private _alertService:AlertService,
    private _router: Router,
    private translate: TranslateService
  )
  {
     this.appAlert={alert:null,show:false};
     this.title='WORKDESK';
     this.translate.setDefaultLang(_userService.getLang());
  }

  ngDoCheck(): void {
    this.identity=this._userService.getIdentity();
    if(this._alertService.getAlert()!=null)
    {
      this.appAlert={alert:this._alertService.getAlert(),show:true};
      setTimeout(() => this._alertService.destroyAlert(), 
                       5000);
    }
    else
    {
      this.appAlert={alert:null,show:false};
    }
    
  }

  ngOnInit(): void {
    this.identity=this._userService.getIdentity();
  }

  changeLang(lang)
  {
    this.translate.use(this._userService.setLang(lang));
  }

  closeAlert() {
    this._alertService.destroyAlert();
  }

  logout()
  {
    this._userService.logout();
    this.identity=null;
    this._router.navigate(['/login']);
  }


}
