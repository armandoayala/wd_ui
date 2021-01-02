import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

//Models
import { GenericResponse } from "../models/genericresponse";
import { OperationResult } from "../models/operationresult";
import { Alert } from "../models/ui/alertui";

//Service
import { UserService } from "./user.service";
import { AlertService } from "./alert.service";

@Injectable({
  providedIn: "root",
})
export class UtilService {
  constructor(
    private translate: TranslateService,
    private _alertService: AlertService,
    private _userService: UserService,
    private _router: Router
  ) {}

  processGenericResponse(genericResponse: GenericResponse): OperationResult {
    var operationResult = OperationResult.defaultInstance();

    operationResult.error = genericResponse.code !== "0" ? true : false;
    operationResult.message = genericResponse.message;
    operationResult.inProgress = false;
    operationResult.httpError = null;
    operationResult.genericResponse = genericResponse;

    return operationResult;
  }

  processHttpError(httpError: any, fnCallback) {
    var operationResult = OperationResult.defaultInstance();
    operationResult.error = true;

    if (httpError.error && httpError.error.message) {
      operationResult.message = httpError.error.message;
    } else {
      operationResult.message = httpError.message;
    }

    operationResult.genericResponse = null;
    operationResult.httpError = httpError;
    operationResult.status = httpError.status;
    operationResult.statusText = httpError.statusText;
    operationResult.inProgress = false;

    if (operationResult.status == 401) {
      this.translate.get("login.message_session_out").subscribe(
        (data) => {
          this._alertService.showAlert(
            new Alert(data, "danger")
          );
          this._userService.logout();
          this._router.navigate(["/login"]);
        },
        (error) => {
          this._alertService.showAlert(
            new Alert(operationResult.message, "danger")
          );
          this._userService.logout();
          this._router.navigate(["/login"]);
        }
      );
    } else {
      this._alertService.showAlert(
        new Alert(operationResult.message, "danger")
      );

      if (fnCallback && typeof fnCallback == "function") {
        fnCallback(operationResult);
      }
    }
  }
}
