import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExceptionSnackbarService } from './exception-snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class HttpPetitions {
  constructor(
    private http: HttpClient,
    private exceptionSnackbarService: ExceptionSnackbarService
  ) {}

  async get<Type>(
    url: string,
    forbiddenErrors?: { errorMessage: string; snackbarMessage: string }[]
  ): Promise<Type | undefined> {
    return new Promise<Type | undefined>((resolve, reject) => {
      this.http
        .get<Type>(url, {
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
