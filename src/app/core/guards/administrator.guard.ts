import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { User } from '@data/interfaces';
import { Observable } from 'rxjs';
import { PATHS } from '../constants/paths.constant';

/**
 * Administrator guard
 * */
@Injectable({
  providedIn: 'root',
})
export class AdministratorGuard implements CanActivate {
  constructor(private router: Router) {}
  /**
   * Checks if a page can be displayed to a user
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user')!) as User;
      if (user.administrator) return true;
    }
    return this.router.parseUrl(
      `${PATHS.ERROR.BASE_PATH}/${PATHS.ERROR.PAGE_NOT_FOUND}`
    );
  }
}
