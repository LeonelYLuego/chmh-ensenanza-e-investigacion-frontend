import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ExceptionSnackbarService, HttpPetitions } from '@core/services';
import { PATHS, SERVER_ENDPOINTS } from '@core/constants';
import { HttpResponse } from '@core/interfaces/http-response.interface';
import { ForbiddenErrorInterface } from '@core/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  readonly forbiddenErrors: ForbiddenErrorInterface[] = [
    {
      errorMessage: 'user already exists',
      snackbarMessage: 'El usuario ya existe',
    },
    {
      errorMessage: 'user not found',
      snackbarMessage: 'Usuario no encontrado',
    },
    {
      errorMessage: 'user not modified',
      snackbarMessage: 'Usuario no modificado',
    },
    {
      errorMessage: 'user not deleted',
      snackbarMessage: 'Usuario no eliminado',
    },
    {
      errorMessage: 'the current user can not be deleted',
      snackbarMessage: 'El Usuario actual no puede ser eliminado',
    },
  ];

  constructor(
    private http: HttpClient,
    private httpPetitions: HttpPetitions,
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
        .post<HttpResponse<{ token?: string; user?: User }>>(
          SERVER_ENDPOINTS.AUTH.LOGIN,
          user
        )
        .subscribe({
          next: (value) => {
            if (value)
              if (value.error) {
                if (
                  this.exceptionSnackbarService.serverPetitionLogIn(value.error)
                )
                  resolve(false);
                else reject(value.error);
              } else if (value.data) {
                if (value.data.token && value.data.user) {
                  localStorage.setItem('token', value.data.token);
                  localStorage.setItem('user', JSON.stringify(value.data.user));
                  resolve(true);
                }
              }
            resolve(false);
          },
          error: (err) => {
            this.exceptionSnackbarService.serverPetition({
              statusCode: 404,
              path: '',
              timestamp: Date.now().toString(),
              exception: undefined,
            });
            reject(err);
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
          .get<HttpResponse<User>>(SERVER_ENDPOINTS.AUTH.LOGGED, {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token')!,
            },
          })
          .subscribe({
            next: (value) => {
              if (value) {
                if (value.data) {
                  localStorage.setItem('user', JSON.stringify(value.data));
                  resolve(true);
                }
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
    this.router.navigate([PATHS.AUTH.BASE_PATH, PATHS.AUTH.LOG_IN]);
  }

  /**
   * Gets all Users
   * @async
   * @function getUsers
   * @returns {Promise<User[]>} The Users
   */
  async getAll(): Promise<User[]> {
    const data = await this.httpPetitions.get<User[]>(
      SERVER_ENDPOINTS.USERS.BASE_ENDPOINT,
      this.forbiddenErrors
    );
    return data ?? [];
  }

  /**
   * Add an User
   * @async
   * @function
   * @param {User} user The User data
   * @returns {Promise<boolean>} `true`: the User has been added, `false`: the User has not been added
   */
  async add(user: User): Promise<User | null> {
    const data = await this.httpPetitions.post<User>(
      SERVER_ENDPOINTS.USERS.BASE_ENDPOINT,
      user,
      this.forbiddenErrors
    );
    return data ?? null;
  }

  /**
   * Updates the specified User
   * @async
   * @param {string} _id _id of the User
   * @param {User} user User to update
   * @returns {Promise<boolean>} `true`: if the User has been updated, `false`: if the User has not been updated
   */
  async update(_id: string, user: User): Promise<User | null> {
    const data = await this.httpPetitions.put<User>(
      SERVER_ENDPOINTS.USERS.BY_ID(_id),
      user,
      this.forbiddenErrors
    );
    return data ?? null;
  }

  /**
   * Deletes the specified User
   * @async
   * @param {string} _id _id of the Student
   * @returns {Promise<boolean>} `true`: if the User has been deleted, `false`: if the User has not been deleted
   */
  async delete(_id: string): Promise<void> {
    await this.httpPetitions.delete<void>(
      SERVER_ENDPOINTS.USERS.BY_ID(_id),
      this.forbiddenErrors
    );
  }
}
