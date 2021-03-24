import { Injectable, Inject } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import { BaseService, ApiResult } from '../BaseService';
import { Observable } from 'rxjs';

import { Country } from '../Country/Country';

@Injectable({
  providedIn: 'root',
})

export class CountryService extends BaseService {

  getData<ApiResult>(pageIndex: number, pageSize: number, sortColumn: string, sortOrder: string, filterColumn: string, filterQuery: string): Observable<ApiResult> {
    let url = this.baseUrl + 'api/Cities';
    let params = new HttpParams().set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
      .set("sortColumn", sortColumn)
      .set("sortOrder", sortOrder);
    if (filterQuery) {
      params = params.set("filterColumn", filterColumn).set("filterQuery", filterQuery);
    }
    return this.http.get<ApiResult>(url, { params });
  }
  get<Country>(id: number): Observable<Country> {
    let url = this.baseUrl + "api/Countries/" + id;
    return this.http.get<Country>(url);
  }
  put<Country>(item): Observable<Country> {
    var url = this.baseUrl + "api/Countries/" + item.id;
    return this.http.put<Country>(url, item);
  }
  post<Country>(item: Country): Observable<Country> {
    let url = this.baseUrl + "api/Countries";
    return this.http.post<Country>(url, item);
  }

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    super(http, baseUrl);
  }

  

  isDupeField(countryId, fieldName, fieldValue): Observable<boolean> {
    var params = new HttpParams()
      .set("countryId", countryId)
      .set("fieldName", fieldName)
      .set("fieldValue", fieldValue)

    var url = this.baseUrl + "api/Countries/IsDupeField";
    return this.http.post<boolean>(url, null, {params});
  }

}
