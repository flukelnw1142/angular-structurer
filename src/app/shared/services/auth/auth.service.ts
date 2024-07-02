import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IUser } from './../../interfaces/user.interface';
import { ISignInPayload, ISignInResponse } from './payload.interface';



@Injectable({ providedIn: 'root' })
export class AuthService {
  isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  user$: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser | null>(
    null
  );
  token$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(
    null
  );

  get isLoggedIn(): boolean {
    return this.isLoggedIn$.value;
  }

  get token(): string | null {
    return this.token$.value;
  }

  get user(): IUser | null {
    return this.user$.value;
  }

  set isLoggedIn(value: boolean) {
    this.isLoggedIn$.next(value);
  }

  set token(value: string | null) {
    localStorage.setItem('token', JSON.stringify(value));
    this.token$.next(value);
  }

  set user(value: IUser | null) {
    localStorage.setItem('user', JSON.stringify(value));
    this.user$.next(value);
  }



  /* -------------------------------------------------------------------------- */
  /*                                 Constructor                                */
  /* -------------------------------------------------------------------------- */
  constructor(private http: HttpClient, private router: Router) {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = JSON.parse(localStorage.getItem('token') || 'null');

    if (user && token) {
      this.user = user;
      this.token = token;
      this.isLoggedIn = true;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Sign In                                  */
  /* -------------------------------------------------------------------------- */
  signIn(payload: ISignInPayload): Observable<ISignInResponse> {
    return this.http.post<ISignInResponse>(
      environment.api_authentication_url,
      {
        ...payload,
      }
    );
  }


  signOut() {
    this.isLoggedIn = false;
    this.token = null;
    localStorage.clear();
    this.router.navigate(['/sign-in']);
  }
}
