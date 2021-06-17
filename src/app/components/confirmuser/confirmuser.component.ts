import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

//Services
import { UserService } from "../../services/user.service";
import { UtilService } from "../../services/util.service";
import { AlertService } from "../../services/alert.service";

//Models
import { GenericResponse } from "../../models/genericresponse";
import { OperationResult } from "../../models/operationresult";
import { Alert } from "../../models/ui/alertui";

@Component({
  selector: "app-confirmuser",
  templateUrl: "./confirmuser.component.html",
  styleUrls: ["./confirmuser.component.css"],
})
export class ConfirmuserComponent implements OnInit {
  public genericResponse: GenericResponse;
  public operationResult: OperationResult;

  constructor(
    private translate: TranslateService,
    private _userService: UserService,
    private _utilService: UtilService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _alertService: AlertService
  ) {
    this.operationResult = new OperationResult(null, "", false);
  }

  ngOnInit() {
    let userToValidate;

    this._route.params.forEach((params: Params) => {
      userToValidate = params;
    });

    this.onSubmit(userToValidate);
  }

  onSubmit(userToValidate) {
    this.operationResult.inProgress = true;

    this._userService
      .confirmUser(userToValidate.id, userToValidate.code)
      .subscribe(
        (response) => {
          this.operationResult =
            this._utilService.processGenericResponse(response);

          if (!this.operationResult.error) {
            this._alertService.showAlert(
              new Alert("general.message_action_success", "success")
            );
          } else {
            this._alertService.showAlert(
              new Alert(this.operationResult.message, "danger")
            );
            //this._router.navigate(['/login']);
          }
        },
        (httpError) => {
          this._utilService.processHttpError(httpError, (data) => {
            this._router.navigate(["/login"]);
          });
        }
      );
  }
}
