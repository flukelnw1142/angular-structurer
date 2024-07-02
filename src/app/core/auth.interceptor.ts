import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, map, merge, Observable, of, switchMap, take, throwError, } from 'rxjs';

import { Injectable } from '@angular/core';

import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AuthUtils } from './auth.utils';

const TOKEN_HEADER_KEY = 'Authorization'; // for Spring Boot back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /* -------------------------------------------------------------------------- */
  /*                                 Constructor                                */
  /* -------------------------------------------------------------------------- */
  constructor(private _authService: AuthService) { }

  /* -------------------------------------------------------------------------- */
  /*                                  Intercept                                 */
  /* -------------------------------------------------------------------------- */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Clone the request object
    let newReq = req.clone();

    const token = this._authService.token;

    if (token && !AuthUtils.isTokenExpired(token)) {
      newReq = this.addTokenHeader(newReq, token);
    }

    // Response
    return next.handle(newReq).pipe(
      catchError(error => {
        console.log(error);

        const isRefreshToken =
          error?.status == 403 || error?.status == 401 || error?.error?.status_code === 'E4001';
        const isMoreOneLoggedInUser = error?.error?.status_code === 'E4005';
        const isReService = error?.error?.statusCode === 'E4007';
        if (isReService) {
          //? โปรดเข้าสู่ระบบอีกครั้ง
          this._authService.signOut();
        }
        if (
          error instanceof HttpErrorResponse &&
          isMoreOneLoggedInUser &&
          !newReq.url.includes('/login')
        ) {
          //? มีผู้ใช้เข้าสู่ระบบมากกว่า 1 คน
          this._authService.signOut();
        }
        if (
          error instanceof HttpErrorResponse &&
          isRefreshToken &&
          !newReq.url.includes('/login')
        ) {
          this._authService.signOut();
        }
        return throwError(() => error);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers.set(TOKEN_HEADER_KEY, `Bearer ${token}`),
    });
  }
}
