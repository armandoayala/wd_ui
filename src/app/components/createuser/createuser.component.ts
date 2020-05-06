import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

//Services
import {UserService} from '../../services/user.service';
import {CONSTANT} from '../../services/constant';

//Models
import {CreateUser} from '../../models/createuser';
import {GenericResponse} from '../../models/genericresponse';
import {OperationResult} from '../../models/operationresult';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.css']
})
export class CreateuserComponent implements OnInit {

  public genericResponse: GenericResponse;
  public operationResult: OperationResult;
  public createUser: CreateUser;
  public locales=[];


  constructor(private _userService: UserService,
              private translate: TranslateService)
  {
     this.createUser= new CreateUser("","","","","","");
     this.operationResult=new OperationResult(null,"",false);

     this.createUser.locale=CONSTANT.locales[0].lang;
     this.locales=CONSTANT.locales;
  }

  ngOnInit() {
  }

  onSubmit()
  {
     this.operationResult.inProgress=true;

     this._userService.createUser(this.createUser).subscribe(
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

}
