import { AuthService } from 'src/app/shared/services/auth/auth.service';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable, of, switchMap, combineLatest } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  /**
   * Constructor
   */
  constructor(private _router: Router, private _authService: AuthService) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Can activate
   *
   * @param route
   * @param state
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
    return this._check(route, redirectUrl);
  }

  /**
   * Can activate child
   *
   * @param childRoute
   * @param state
   */
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
    return this._check(childRoute, redirectUrl);
  }

  /**
   * Can load
   *
   * @param route
   * @param segments
   */
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Check the authenticated status
   *
   * @param redirectURL
   * @private
   */
  private _check(
    route: ActivatedRouteSnapshot,
    redirectURL: string
  ): Observable<boolean> {
    // Check the authentication status
    return combineLatest([
      this._authService.isLoggedIn$,
    ]).pipe(
      switchMap(([authenticated]) => {
        // If the user is not authenticated...
        if (!authenticated) {
          // Redirect to the sign-in page
          this._router.navigate(['sign-in'], { queryParams: { redirectURL } });

          // Prevent the access
          return of(false);
        }

        return of(true);
      })
    );
  }
}
