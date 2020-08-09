import { GenericResponse } from './genericresponse';

export class OperationResult{

  public error: Boolean;
  public message: string;
  public inProgress: Boolean;
  public genericResponse:GenericResponse;
  public httpError:any;
  public status:number;
  public statusText:string;

  constructor(
    //Se puede declarar aqui las propiedades como forma de atajo,
    //Sino deberia declaralo por fuera y luego pasar por parametro en el constructor
    pError: Boolean,
    pMessage: string,
    pInProgress: Boolean
  )
  {
     this.error=pError;
     this.message=pMessage;
     this.inProgress=pInProgress;
  }

  static defaultInstance()
  {
    return new OperationResult(null,"",false);
  }

}
