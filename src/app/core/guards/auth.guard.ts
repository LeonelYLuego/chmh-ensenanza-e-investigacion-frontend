import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { UsersService } from '@app/data/services/users.service';
import { PATHS } from '../constants/paths.constant';

/**
 * Checks if the user is authorized
 * @class Authentication Guard
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private usersService: UsersService) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    if (await this.usersService.logged()) {
      return true;
    }
    return this.router.parseUrl(PATHS.LOG_IN);
  }
}

@Injectable({
  providedIn: 'root',
})
export class NotAuthGuard implements CanActivate {
  constructor(private router: Router, private usersService: UsersService) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    if (!(await this.usersService.logged())) {
      return true;
    }
    return this.router.parseUrl(PATHS.PAGE_NOT_FOUND);
  }
}
