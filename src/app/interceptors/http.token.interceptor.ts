import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ActivationEnd, ActivationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HttpTokenInterceptor implements HttpInterceptor {
  currentUser: any;

  constructor(private router: Router) {
    router.events.subscribe((val) => {

      this.currentUser = JSON.parse(localStorage.getItem('tcmuser') || '{}');

      if (!this.router.routerState.snapshot.url.includes('login') &&
        (val instanceof ActivationEnd || val instanceof ActivationStart) &&
        val.snapshot?.data['menuCode']?.length) {

        const hasRoutePermit = val.snapshot.data['menuCode'].some((code: any) => this.currentUser?.role == code
        );

        if (!hasRoutePermit) {
          localStorage.removeItem('tcmuser');
          localStorage.removeItem('tcmuserStamp');
          this.router.navigate(['/login']);
          setTimeout(() => {
            location.reload();
          }, 10);
        }
      }
    });
  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      req.url.includes('auth')
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

    // console.log(token);


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
