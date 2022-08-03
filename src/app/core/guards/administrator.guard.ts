import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { User } from '@app/data/interfaces/user';
import { Observable } from 'rxjs';
import { URL } from '../constants/urls.constant';

@Injectable({
  providedIn: 'root'
})
export class AdministratorGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user')!) as User;
      if(user.administrator)
        return true;
    }
    return this.router.parseUrl(URL.PAGE_NOT_FOUND);
  }
  
}
