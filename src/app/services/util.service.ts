import { Injectable } from '@angular/core';

//Models
import { GenericResponse } from '../models/genericresponse';
import { OperationResult } from '../models/operationresult';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  processGenericResponse(genericResponse: GenericResponse): OperationResult {
    var operationResult = OperationResult.defaultInstance();

    operationResult.error = (genericResponse.code !== "0" ? true : false);
    operationResult.message = genericResponse.message;
    operationResult.inProgress = false;
    operationResult.httpError = null;
    operationResult.genericResponse = genericResponse;

    return operationResult;
  }

  processHttpError(httpError: any): OperationResult {
    var operationResult = OperationResult.defaultInstance();
    operationResult.error = true;

    if (httpError.error && httpError.error.message) {
      operationResult.message = httpError.error.message;
    }
    else {
      operationResult.message = httpError.message;
    }

    operationResult.genericResponse = null;
    operationResult.httpError = httpError;
    operationResult.status = httpError.status;
    operationResult.status = httpError.statusText;
    operationResult.inProgress = false;
    return operationResult;
  }

}
