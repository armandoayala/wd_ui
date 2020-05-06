export class GenericResponse{
  constructor(
    //Se puede declarar aqui las propiedades como forma de atajo,
    //Sino deberia declaralo por fuera y luego pasar por parametro en el constructor
    public code: string,
    public message: string,
    public data
    //public data:{}
  )
  {


  }

}
