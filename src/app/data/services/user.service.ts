import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { HttpClient } from '@angular/common/http';
import { ENDPOINT } from '@app/core/constants/endpoints.constant';
import { Router } from '@angular/router';
import { URL } from '@app/core/constants/urls.constant';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private router: Router) {}

  async logIn(user: { username: string; password: string }): Promise<boolean> {
    localStorage.clear();
    return new Promise<boolean>((resolve, reject) => {
      this.http
        .post<{ token?: string; user?: User }>(ENDPOINT.AUTH.LOGIN, user)
        .subscribe({
          next: (value) => {
            if (value)
              if (value.token && value.user) {
                localStorage.setItem('token', value.token);
                localStorage.setItem('user', JSON.stringify(value.user));
                resolve(true);
              }
            resolve(false);
          },
          error: (err) => {
            if (err.status == 401) resolve(false);
            else reject(err);
          },
        });
    });
  }

  async logged(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (localStorage.getItem('token')) {
        this.http
          .get<User>(ENDPOINT.AUTH.LOGGED, {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token')!,
            },
          })
          .subscribe({
            next: (value) => {
              if (value) {
                localStorage.setItem('user', JSON.stringify(value));
                resolve(true);
              } else {
                localStorage.clear();
                resolve(false);
              }
            },
            error: () => {
              localStorage.clear();
              resolve(false);
            },
          });
      } else {
        localStorage.clear();
        resolve(false);
      }
    });
  }

  logOut(): void {
    localStorage.clear();
    this.router.navigate([URL.LOG_IN])
  }
}
