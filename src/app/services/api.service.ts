import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { GLOBAL } from './global';
import { CONSTANT } from './constant';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public apiUrl: string;

  constructor(private _userService: UserService) {
    this.apiUrl = GLOBAL.url;
  }

  public getRequestOptions(page?: number, limit?: number) {

    limit = limit || CONSTANT.page_limit
    page = page || 0

    let httpParams = new HttpParams()
    .set('page', page.toString())
    .set('limit', limit.toString());

    let httpHeaders = this._userService.prepareHttpOptions()

    let httpOptions = {
      headers: httpHeaders.headers,
      params: httpParams
    };

    return httpOptions
  }

  public postRequestOptions() {

    return this._userService.prepareHttpOptions()
  }

}
