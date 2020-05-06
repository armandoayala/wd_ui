export class AccesslinkCreate{
    constructor(
      //Se puede declarar aqui las propiedades como forma de atajo,
      //Sino deberia declaralo por fuera y luego pasar por parametro en el constructor
      public title: string,
      public url: string,
      public description: string,
      public isNotValid: boolean
    )
    {
  
  
    }
  
  }