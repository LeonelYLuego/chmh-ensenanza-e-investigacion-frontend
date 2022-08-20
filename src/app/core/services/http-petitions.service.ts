import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExceptionSnackbarService } from './exception-snackbar.service';

@Injectable({
  providedIn: 'root',
})
/**
 * Manages the http petitions with snackbar messages and authentication
 * @class Http Petitions
 */
export class HttpPetitions {
  constructor(
    private http: HttpClient,
    private exceptionSnackbarService: ExceptionSnackbarService
  ) {}

  /**
   * Does a Get petition
   * @async
   * @param {string} url URL of the server
   * @param {{errorMessage: string, snackbarMessage: string}[]} forbiddenErrors errors to show with snackbars
   * @param {{name: string, value: string}[]} params params for do a query petition
   * @returns {any} returns the petition response
   */
  async get<Type>(
    url: string,
    forbiddenErrors?: { errorMessage: string; snackbarMessage: string }[],
    params?: { name: string; value: string }[]
  ): Promise<Type | undefined> {
    let sendParams: undefined | HttpParams = undefined;
    if (params) {
      sendParams = new HttpParams();
      params.map((param) => {
        sendParams = sendParams!.set(param.name, param.value);
      });
    }
    return new Promise<Type | undefined>((resolve, reject) => {
      this.http
        .get<Type>(url, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')!,
          },
          params: sendParams,
        })
        .subscribe({
          next: (value) => resolve(value),
          error: (err) => {
            if (
              this.exceptionSnackbarService.serverPetition(err, forbiddenErrors)
            )
              resolve(undefined);
            else reject(err);
          },
        });
    });
  }

  /**
   * Does a Post petition
   * @async
   * @param {string} url URL of the server
   * @param {{errorMessage: string, snackbarMessage: string}[]} forbiddenErrors errors to show with snackbars
   * @returns {any} returns the petition response
   */
  async post<Type>(
    url: string,
    body: any,
    forbiddenErrors?: { errorMessage: string; snackbarMessage: string }[]
  ): Promise<Type | undefined> {
    return new Promise<Type | undefined>((resolve, reject) => {
      this.http
        .post<Type>(url, body, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')!,
          },
        })
        .subscribe({
          next: (value) => resolve(value),
          error: (err) => {
            if (
              this.exceptionSnackbarService.serverPetition(err, forbiddenErrors)
            )
              resolve(undefined);
            else reject(err);
          },
        });
    });
  }

  /**
   * Does a Put petition
   * @async
   * @param {string} url URL of the server
   * @param {{errorMessage: string, snackbarMessage: string}[]} forbiddenErrors errors to show with snackbars
   * @returns {any} returns the petition response
   */
  async put<Type>(
    url: string,
    body: any,
    forbiddenErrors?: { errorMessage: string; snackbarMessage: string }[]
  ): Promise<Type | undefined> {
    return new Promise<Type | undefined>((resolve, reject) => {
      this.http
        .put<Type>(url, body, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')!,
          },
        })
        .subscribe({
          next: (value) => resolve(value),
          error: (err) => {
            if (
              this.exceptionSnackbarService.serverPetition(err, forbiddenErrors)
            )
              resolve(undefined);
            else reject(err);
          },
        });
    });
  }

  /**
   * Does a Delete petition
   * @async
   * @param {string} url URL of the server
   * @param {{errorMessage: string, snackbarMessage: string}[]} forbiddenErrors errors to show with snackbars
   * @returns {any} returns the petition response
   */
  async delete<Type>(
    url: string,
    forbiddenErrors?: { errorMessage: string; snackbarMessage: string }[]
  ): Promise<Type | undefined> {
    return new Promise<Type | undefined>((resolve, reject) => {
      this.http
        .delete<Type>(url, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')!,
          },
        })
        .subscribe({
          next: (value) => resolve(value),
          error: (err) => {
            if (
              this.exceptionSnackbarService.serverPetition(err, forbiddenErrors)
            )
              resolve(undefined);
            else reject(err);
          },
        });
    });
  }
}
