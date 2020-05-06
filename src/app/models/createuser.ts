export class CreateUser{
  constructor(
    //Se puede declarar aqui las propiedades como forma de atajo,
    //Sino deberia declaralo por fuera y luego pasar por parametro en el constructor
    public name: String,
    public surname: String,
    public email: String,
    public password: String,
    public confirmPassword: String,
    public locale: String

  )
  {


  }

}
