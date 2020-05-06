export class PasswordChange{
  constructor(
    //Se puede declarar aqui las propiedades como forma de atajo,
    //Sino deberia declaralo por fuera y luego pasar por parametro en el constructor
    public email: String,
    public password: String,
    public confirmPassword: String,
    public code: Number
  )
  {


  }

}
