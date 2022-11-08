import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpResponse } from '@core/interfaces/http-response.interface';
import { ForbiddenErrorInterface } from '../interfaces/forbidden-error.interface';
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
    private exceptionSnackbarService: ExceptionSnackbarService,
    private sanitizer: DomSanitizer
  ) {}

  /**
   * Does a Get petition
   * @async
   * @param {string} url URL of the server
   * @param {ForbiddenErrorInterface[]} forbiddenErrors errors to show with snackbars
   * @param {{name: string, value: string}[]} params params for do a query petition
   * @returns {any} returns the petition response
   */
  async get<Type>(
    url: string,
    forbiddenErrors?: ForbiddenErrorInterface[],
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
        .get<HttpResponse<Type>>(url, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')!,
          },
          params: sendParams,
        })
        .subscribe({
          next: (value) => {
            if (value.error) {
              if (
                this.exceptionSnackbarService.serverPetition(
                  value.error,
                  forbiddenErrors
                )
              )
                resolve(undefined);
              else reject(value.error);
            } else resolve(value.data);
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }

  /**
   * Gets a blob file
   * @param url URL of the server
   * @param forbiddenErrors errors to show with snackbars
   * @param params params for do a query petition
   * @returns the petition response
   */
  async getBlob(
    url: string,
    forbiddenErrors?: ForbiddenErrorInterface[],
    params?: { name: string; value: string }[]
  ): Promise<Blob | undefined> {
    return new Promise<Blob | undefined>((resolve, reject) => {
      let sendParams: undefined | HttpParams = undefined;
      if (params) {
        sendParams = new HttpParams();
        params.map((param) => {
          sendParams = sendParams!.set(param.name, param.value);
        });
      }
      this.http
        .get(url, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')!,
          },
          params: sendParams,
          responseType: 'blob',
        })
        .subscribe({
          next: async (value) => {
            if (value.type == 'application/json') {
              const content = JSON.parse(
                await value.text()
              ) as HttpResponse<void>;
              if (
                this.exceptionSnackbarService.serverPetition(
                  content.error!,
                  forbiddenErrors
                )
              )
                resolve(undefined);
              else reject(content.error);
            } else resolve(value);
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }

  /**
   * Gets the url of a file
   * @param url URL of the server
   * @param forbiddenErrors errors to show with snackbars
   * @param params params for do a query petition
   * @returns the petition response
   */
  async getFileUrl(
    url: string,
    forbiddenErrors?: ForbiddenErrorInterface[],
    params?: { name: string; value: string }[]
  ): Promise<SafeResourceUrl | undefined> {
    return new Promise<SafeResourceUrl | undefined>((resolve, reject) => {
      let sendParams: undefined | HttpParams = undefined;
      if (params) {
        sendParams = new HttpParams();
        params.map((param) => {
          sendParams = sendParams!.set(param.name, param.value);
        });
      }
      this.http
        .get(url, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')!,
          },
          params: sendParams,
          responseType: 'blob',
        })
        .subscribe({
          next: (value) => {
            if ((value as any).error) {
              this.exceptionSnackbarService.serverPetition(
                (value as any).error,
                forbiddenErrors
              );
              resolve(undefined);
            } else {
              const fileURL = URL.createObjectURL(value as Blob);
              const sanitizedURL =
                this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
              resolve(sanitizedURL);
            }
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }

  /**
   * Does a Post petition
   * @async
   * @param {string} url URL of the server
   * @param {ForbiddenErrorInterface[]} forbiddenErrors errors to show with snackbars
   * @returns {any} returns the petition response
   */
  async post<Type>(
    url: string,
    body: any,
    forbiddenErrors?: ForbiddenErrorInterface[],
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
        .post<HttpResponse<Type>>(url, body, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')!,
          },
          params: sendParams,
        })
        .subscribe({
          next: (value) => {
            if (value.error) {
              if (
                this.exceptionSnackbarService.serverPetition(
                  value.error,
                  forbiddenErrors
                )
              )
                resolve(undefined);
              else reject(value.error);
            } else resolve(value.data);
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }

  /**
   * Does a Put petition
   * @async
   * @param {string} url URL of the server
   * @param {ForbiddenErrorInterface[]} forbiddenErrors errors to show with snackbars
   * @returns {any} returns the petition response
   */
  async put<Type>(
    url: string,
    body: any,
    forbiddenErrors?: ForbiddenErrorInterface[],
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
        .put<HttpResponse<Type>>(url, body, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')!,
          },
          params: sendParams,
        })
        .subscribe({
          next: (value) => {
            if (value.error) {
              if (
                this.exceptionSnackbarService.serverPetition(
                  value.error,
                  forbiddenErrors
                )
              )
                resolve(undefined);
              else reject(value.error);
            } else resolve(value.data);
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }

  /**
   * Does a Delete petition
   * @async
   * @param {string} url URL of the server
   * @param {ForbiddenErrorInterface[]} forbiddenErrors errors to show with snackbars
   * @returns {any} returns the petition response
   */
  async delete<Type>(
    url: string,
    forbiddenErrors?: ForbiddenErrorInterface[],
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
        .delete<HttpResponse<Type>>(url, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')!,
          },
          params: sendParams,
        })
        .subscribe({
          next: (value) => {
            if (value.error) {
              if (
                this.exceptionSnackbarService.serverPetition(
                  value.error,
                  forbiddenErrors
                )
              )
                resolve(undefined);
              else reject(value.error);
            } else resolve(value.data);
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }
}
