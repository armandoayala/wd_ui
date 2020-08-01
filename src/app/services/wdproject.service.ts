import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { ApiService } from './api.service';
import { UserService } from './user.service';

import { GenericResponse } from '../models/genericresponse';
import { WDProject, WDData } from '../models/wdproject';
import { GenericFilter } from '../models/generic-filter';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WdprojectService {

  private url: string;

  constructor(private _http: HttpClient,
    private _apiService: ApiService) {
    this.url = _apiService.apiUrl;
  }


  findAll(filter: GenericFilter, page?: number, limit?: number): Observable<GenericResponse> {
    return this._http.post<GenericResponse>(this.url + 'wdproject/find', filter, this._apiService.getRequestOptions(page, limit));
  }

}
