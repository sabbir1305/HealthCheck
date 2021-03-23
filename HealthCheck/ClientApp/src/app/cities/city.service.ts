import { Injectable, Inject } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import { BaseService, ApiResult } from '../BaseService';
import { Observable } from 'rxjs';

import { City } from '../cities/City';

@Injectable({
  providedIn: 'root',
})

export class CityService extends BaseService {

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
  get<City>(id: number): Observable<City> {
    let url = this.baseUrl + "api/cities/" + id;
    return this.http.get<City>(url);
  }
  put<City>(item): Observable<City> {
    var url = this.baseUrl + "api/Cities/" + item.id;
    return this.http.put<City>(url, item);
  }
  post<City>(item: City): Observable<City> {
    let url = this.baseUrl + "api/Cities";
    return this.http.post<City>(url,item);
  }

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    super(http,baseUrl);
  }

  getCountries<ApiResult>(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string
  ): Observable<ApiResult> {
    var url = this.baseUrl + 'api/Countries';
    var params = new HttpParams()
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
      .set("sortColumn", sortColumn)
      .set("sortOrder", sortOrder);
    if (filterQuery) {
      params = params
        .set("filterColumn", filterColumn)
        .set("filterQuery", filterQuery);
    }
    return this.http.get<ApiResult>(url, { params });
  }

  isDupeCity(item): Observable<boolean> {
    var url = this.baseUrl + "api/Cities/IsDupeCity";
    return this.http.post<boolean>(url, item);
  }

}
