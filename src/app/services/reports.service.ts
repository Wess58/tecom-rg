import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable, config } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  baseUrl = environment.API_ENDPOINT + "/api";

  constructor(private httpClient: HttpClient) { }

  getReports(options: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/reports`,
      { observe: "response", params: options }
    );
  }

  createReport(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/reports`, data);
  }


}
