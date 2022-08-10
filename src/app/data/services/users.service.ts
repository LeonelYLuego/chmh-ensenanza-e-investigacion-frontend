import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { HttpClient } from '@angular/common/http';
import { SERVER_ENDPOINTS } from '@app/core/constants/server-endpoints.constant';
import { Router } from '@angular/router';
import { ExceptionSnackbarService } from '@app/core/services/exception-snackbar.service';
import { PATHS } from '@app/core/constants/paths.constant';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private exceptionSnackbarService: ExceptionSnackbarService
  ) {}

  /**
   * Gets the token and user, and saves them in to local storage
   * @async
   * @function logIn
   * @param {{username: string, password: string}} user The User username and password
   * @returns {Promise<boolean>} `true`: user logged in, `false`: user not authorized to log in
   */
  async logIn(user: { username: string; password: string }): Promise<boolean> {
    localStorage.clear();
    return new Promise<boolean>((resolve, reject) => {
      this.http
        .post<{ token?: string; user?: User }>(
          SERVER_ENDPOINTS.AUTH.LOGIN,
          user
        )
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
            if (this.exceptionSnackbarService.serverPetitionLogIn(err))
              resolve(false);
            else reject(err);
          },
        });
    });
  }

  /**
   * Gets if the User is logged in based on the token storaged in local storage
   * @async
   * @function logged
   * @returns {Promise<boolean>} `true`: the user is logged, `false` the user is not logged
   */
  async logged(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (localStorage.getItem('token')) {
        this.http
          .get<User>(SERVER_ENDPOINTS.AUTH.LOGGED, {
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

  /**
   * Log out the User
   * @function logOut
   */
  logOut(): void {
    localStorage.clear();
    this.router.navigate([PATHS.LOG_IN]);
  }

  /**
   * Gets all Users
   * @async
   * @function getUsers
   * @returns {Promise<User[]>} The Users
   */
  async getUsers(): Promise<User[]> {
    return new Promise<User[]>((resolve, reject) => {
      this.http
        .get<User[]>(SERVER_ENDPOINTS.USERS, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')!,
          },
        })
        .subscribe({
          next: (value) => {
            resolve(value);
          },
          error: (err) => {
            if (this.exceptionSnackbarService.serverPetition(err)) resolve([]);
            else reject(err);
          },
        });
    });
  }

  /**
   * Add an User
   * @async
   * @function
   * @param {User} user The User data
   * @returns {Promise<boolean>} `true`: the User has been added, `false`: the User has not been added
   */
  async addUser(user: User): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http
        .post<User>(
          SERVER_ENDPOINTS.USERS,
          {
            username: user.username,
            password: user.password,
            administrator: user.administrator,
          },
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token')!,
            },
          }
        )
        .subscribe({
          next: () => {
            resolve(true);
          },
          error: (err) => {
            if (
              this.exceptionSnackbarService.serverPetition(err, [
                {
                  errorMessage: 'user already exists',
                  snackbarMessage: 'El Usuario ya existe',
                },
              ])
            )
              resolve(false);
            else reject(err);
          },
        });
    });
  }

  async updateUser(_id: string, user: User): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http
        .put<User>(
          `${SERVER_ENDPOINTS.USERS}/${_id}`,
          {
            username: user.username,
            password: user.password,
            administrator: user.administrator,
          },
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token')!,
            },
          }
        )
        .subscribe({
          next: () => {
            resolve(true);
          },
          error: (err) => {
            if (
              this.exceptionSnackbarService.serverPetition(err, [
                {
                  errorMessage: 'user not found',
                  snackbarMessage: 'El Usuario es inválido',
                },
                {
                  errorMessage: 'user not modified',
                  snackbarMessage: 'El Usuario no se modificó',
                },
              ])
            )
              resolve(false);
            else reject(err);
          },
        });
    });
  }

  async deleteUser(_id: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http
        .delete(`${SERVER_ENDPOINTS.USERS}/${_id}`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')!,
          },
        })
        .subscribe({
          next: () => resolve(true),
          error: (err) => {
            if (this.exceptionSnackbarService.serverPetition(err, [
              {
                errorMessage: 'user not found',
                snackbarMessage: 'El Usuario es inválido',
              },
              {
                errorMessage: 'user not modified',
                snackbarMessage: 'El Usuario no se modificó',
              },
              {
                errorMessage: 'the current user can not be deleted',
                snackbarMessage: 'El Usuario actual no puede ser eliminado'
              }
            ]))
              resolve(false);
            else reject(err);
          },
        });
    });
  }
}
