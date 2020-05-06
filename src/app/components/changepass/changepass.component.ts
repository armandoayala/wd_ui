import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

//Services
import {UserService} from '../../services/user.service';

//Models
import {PasswordChange} from '../../models/passwordchange';
import {GenericResponse} from '../../models/genericresponse';
import {OperationResult} from '../../models/operationresult';
import { isNumber } from 'util';

@Component({
  selector: 'app-changepass',
  templateUrl: './changepass.component.html',
  styleUrls: ['./changepass.component.css']
})
export class ChangepassComponent implements OnInit
{
  public genericResponse: GenericResponse;
  public passwordChange: PasswordChange;
  public operationResult: OperationResult;

  constructor(private _userService: UserService,
              private _router: Router)
  {
     this.passwordChange= new PasswordChange("","","",null);
     this.operationResult=new OperationResult(null,"",false);
  }

  ngOnInit() {
  }

  onSubmit()
  {

    this.operationResult.inProgress=true;

    this._userService.changePassword(this.passwordChange).subscribe(
    response => {
       this.genericResponse=response;
       this.operationResult.error=(this.genericResponse.code!=="0"?true:false);
       this.operationResult.message=this.genericResponse.message;
       this.operationResult.inProgress=false;

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

  retry()
  {
    this.passwordChange= new PasswordChange("","","",null);
    this.operationResult=new OperationResult(null,"",false);
  }

}
