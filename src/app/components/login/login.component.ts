import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

//Services
import {UserService} from '../../services/user.service';

//Models
import {Credential} from '../../models/credential';
import {GenericResponse} from '../../models/genericresponse';
import {OperationResult} from '../../models/operationresult';
import {User} from '../../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public genericResponse: GenericResponse;
  public credential: Credential;
  public user:User;
  public operationResult: OperationResult;

  constructor(private _userService: UserService,
              private _router: Router,
              private translate: TranslateService)
  {
    this.credential= new Credential('','');
    this.operationResult=new OperationResult(null,"",false);
  }

  ngOnInit()
  {
    //Validate if user has logged, if is true go to home else go to login
  }

  onSubmit()
  {
    this.operationResult.inProgress=true;
    this._userService.signup(this.credential).subscribe(
    response => {
      this.genericResponse=response;
      this.operationResult.error=(this.genericResponse.code!=="0"?true:false);
      this.operationResult.message=this.genericResponse.message;
      this.operationResult.inProgress=false;

       this.genericResponse=response;

       if(!this.operationResult.error)
       {

             this._userService.saveIdentity(this.genericResponse);
             //Re dirijo a la pagina Home
             this._router.navigate(['/']);
       }

    },
    httpError => {

        this.operationResult.error=true;

        if(httpError.error && httpError.error.message)
        {
           this.operationResult.message=httpError.error.message;
        }
        else
        {
          this.operationResult.message=httpError.message;
        }

        this.operationResult.inProgress=false;

    }


  );

  }

}
