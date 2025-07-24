import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private router: Router) { }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      req.url.includes('login')
      // req.url.includes('registration') ||
      // req.url.includes('registration/contact')
    ) {
      return next.handle(req);
    }
    const headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // 'Content-Type': 'multipart/form-data',
    };

    const token = localStorage.getItem('basicAuth');

    const request = req.clone({
      setHeaders: {
        Authorization: `Basic ${token}`,
      },
    });

    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401 || err.status === 403) {
          if (!this.router.routerState.snapshot.url.includes('verify')) {
            localStorage.removeItem('basicAuth');

            if (!this.router.routerState.snapshot.url.includes('login')) {
              // localStorage.setItem('url', this.router.routerState.snapshot.url)
            }
            this.router.navigate(['/login']);

          }
        }
        // const error = err.error.message || err.statusText;
        return throwError(err.error);
      })
    );
  }
}
