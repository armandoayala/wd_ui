import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';

import {Credential} from '../models/credential';
import {GenericResponse} from '../models/genericresponse';
import {User} from '../models/user';
import {PasswordChange} from '../models/passwordchange';
import {CreateUser} from '../models/createuser';
import {CONSTANT} from './constant';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public url: string;
  public activeLang: string;

  constructor(private _http:HttpClient)
  {
    this.url=GLOBAL.url;
    this.activeLang='en';
  }

  prepareHttpOptions()
  {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    httpOptions.headers = httpOptions.headers.set('App-Locale', this.getLang());

    var user=this.getIdentity();
    if(user!=null)
    {
      httpOptions.headers = httpOptions.headers.set('Authorization', CONSTANT.jwt_token_prefix+user.token);
    }

    return httpOptions;
  }

  signup(credential: Credential) : Observable<GenericResponse>
  {
     return this._http.post<GenericResponse>(this.url+'user/login',credential,this.prepareHttpOptions());
  }

  recoveryPassword(emailAddress: String) : Observable<GenericResponse>
  {
     return this._http.post<GenericResponse>(this.url+'user/recovery-password',{email:emailAddress},this.prepareHttpOptions());
  }

  changePassword(passwordChange: PasswordChange) : Observable<GenericResponse>
  {
     return this._http.post<GenericResponse>(this.url+'user/change-password',{email:passwordChange.email,password:passwordChange.password,code:passwordChange.code},this.prepareHttpOptions());
  }

  confirmUser(id: string,code: string) : Observable<GenericResponse>
  {
     return this._http.put<GenericResponse>(this.url+'user/confirm-user'+"/"+id+"/"+code,{},this.prepareHttpOptions());
  }

  createUser(createUser: CreateUser) : Observable<GenericResponse>
  {
     return this._http.post<GenericResponse>(this.url+'user/create',{name:createUser.name,surname:createUser.surname,email:createUser.email,password:createUser.password,locale:createUser.locale},this.prepareHttpOptions());
  }

  saveIdentity(identity)
  {
    let user=new User("","","",false,"","");

    user.name=identity.data.user.name;
    user.surname=identity.data.user.surname;
    user.email=identity.data.user.email;
    user.isAdmin=identity.data.user.isAdmin;
    user.token=identity.data.token;
    user.locale=identity.data.user.locale;

    if(user.locale)
    {
      this.setLang(user.locale);
    }

    localStorage.setItem(GLOBAL.keyIdentity,JSON.stringify(user));
  }

  getIdentity() : User
  {
    let jsonUser=localStorage.getItem(GLOBAL.keyIdentity);

    if(!jsonUser)
    {
      return null;
    }

    let user= JSON.parse(jsonUser);
    if(user != "undefined")
    {
       return user;
    }

    return null;
  }

  getLang(): string
  {
    return this.activeLang;
  }

  setLang(lang : string): string
  {
    this.activeLang=lang;
    return this.activeLang;
  }

  logout()
  {
    localStorage.clear();
  }

}
