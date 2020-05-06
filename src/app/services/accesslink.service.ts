import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';
import { UserService } from './user.service';

import {GenericResponse} from '../models/genericresponse';
import {Accesslink} from '../models/accesslink';
import {AccesslinkFilter} from '../models/accesslinkfilter';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccesslinkService
{
  public url: string;

  constructor(private _http:HttpClient,
              private _userService: UserService )
  {
    this.url=GLOBAL.url;
  }

  findAll(filter: AccesslinkFilter) : Observable<GenericResponse>
  {
     return this._http.post<GenericResponse>(this.url+'accesslink/find',filter,this._userService.prepareHttpOptions());
  }

  createAccessLink(accessLink: Accesslink) : Observable<GenericResponse>
  {
     return this._http.post<GenericResponse>(this.url+'accesslink/create',accessLink,this._userService.prepareHttpOptions());
  }

  deleteAccessLink(accessLinkId: string) : Observable<GenericResponse>
  {
     return this._http.delete<GenericResponse>(this.url+'accesslink/delete/'+accessLinkId,this._userService.prepareHttpOptions());
  }


}
