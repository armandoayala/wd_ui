import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

//Services
import {UserService} from '../../services/user.service';

import {GenericResponse} from '../../models/genericresponse';
import {Credential} from '../../models/credential';

@Component({
  selector: 'app-recoverypass',
  templateUrl: './recoverypass.component.html',
  styleUrls: ['./recoverypass.component.css']
})
export class RecoverypassComponent implements OnInit {

  public genericResponse: GenericResponse;
  public credential: Credential;
  public error: Boolean;
  public inProgress: Boolean;
  public descriptionRes: String;

  constructor(private _userService: UserService,
              private _router: Router,
              private translate: TranslateService)
  {
     this.credential= new Credential('','');
     this.error=null;
     this.inProgress=false;
     this.descriptionRes="";
  }

  ngOnInit() {
  }

  onSubmit()
  {
      this.inProgress=true;
      this._userService.recoveryPassword(this.credential.email).subscribe(
      response => {
         this.genericResponse=response;
         this.error=(this.genericResponse.code!=="0"?true:false);
         this.descriptionRes=this.genericResponse.message;
         this.inProgress=false;

      },
      httpError => {

          this.error=true;

          if(httpError.error && httpError.error.message)
          {
             this.descriptionRes=httpError.error.message;
          }
          else
          {
            this.descriptionRes=httpError.message;
          }

          this.inProgress=false;

      }


    );

  }

  retry()
  {
    this.credential= new Credential('','');
    this.error=null;
    this.descriptionRes="";
    this.inProgress=false;
  }

}
