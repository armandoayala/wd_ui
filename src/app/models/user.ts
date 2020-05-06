export class User{
  constructor(
    //Se puede declarar aqui las propiedades como forma de atajo,
    //Sino deberia declaralo por fuera y luego pasar por parametro en el constructor
    public name: string,
    public surname: string,
    public email: string,
    public isAdmin: boolean,
    public token: string,
    public locale: string

  )
  {


  }

}
