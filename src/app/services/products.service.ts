import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable, config } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  baseUrl = environment.API_ENDPOINT + "/api";

  constructor(private httpClient: HttpClient) { }

  getProducts(options: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/products`,
      { observe: "response", params: options }
    );
  }

  getOneProduct(id: number): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/products/${id}`,
      { observe: "response" }
    );
  }

  createProduct(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/products`, data);
  }

  uploadFile(formData: FormData): Observable<any> {

    const req = new HttpRequest('POST', 'api/media/upload', formData, {
      reportProgress: true,
    });

    return this.httpClient.request(req);
  }

  updateProduct(data: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/products`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/organizations/${id}`);
  }

}
