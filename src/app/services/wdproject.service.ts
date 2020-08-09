import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { ApiService } from './api.service';
import { UserService } from './user.service';

import { GenericResponse } from '../models/genericresponse';
import { WDProject, WDData } from '../models/wdproject';
import { WDProjectUpdate } from '../models/ui/wdprojectupdate';
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

  findById(id: string): Observable<GenericResponse> {
    return this._http.get<GenericResponse>(this.url + 'wdproject/find/' + id, this._apiService.postRequestOptions());
  }

  create(entity: WDProject): Observable<GenericResponse> {
    return this._http.post<GenericResponse>(this.url + 'wdproject/create', entity, this._apiService.postRequestOptions());
  }

  update(id: string, data: any): Observable<GenericResponse> {
    return this._http.put<GenericResponse>(this.url + 'wdproject/update/' + id, data, this._apiService.postRequestOptions());
  }

  delete(id: string): Observable<GenericResponse> {
    return this._http.delete<GenericResponse>(this.url + 'wdproject/delete/' + id + '/wd-del-1', this._apiService.postRequestOptions());
  }

  activate(id: string): Observable<GenericResponse> {
    return this._http.put<GenericResponse>(this.url + 'wdproject/activate/' + id, null, this._apiService.postRequestOptions());
  }

  inactivate(id: string): Observable<GenericResponse> {
    return this._http.put<GenericResponse>(this.url + 'wdproject/inactivate/' + id, null, this._apiService.postRequestOptions());
  }

}
