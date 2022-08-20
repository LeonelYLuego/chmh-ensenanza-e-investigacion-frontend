import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

interface ServerExceptionResponse {
  statusCode: number;
  timestamp: Date;
  path: string;
  exception: string | any;
}

/** @class Exception Snackbar Service */
@Injectable({
  providedIn: 'root',
})
export class ExceptionSnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  private serverException(message: string) {
    this.snackBar.open(`Error del servidor: ${message}`, undefined, {
      duration: 2000,
      panelClass: 'warn-snackbar',
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }

  private forbiddenException(
    message: string,
    forbiddenErrors: { errorMessage: string; snackbarMessage: string }[]
  ) {
    for (let errorMessage of forbiddenErrors) {
      if (errorMessage.errorMessage == message) {
        this.snackBar.open(errorMessage.snackbarMessage, undefined, {
          duration: 2000,
          panelClass: 'accent-snackbar',
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
        break;
      }
    }
  }

  private unauthorizedException() {
    this.snackBar.open('Petición no autorizada', undefined, {
      duration: 2000,
      panelClass: 'warn-snackbar',
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }

  private pageNotFound() {
    this.snackBar.open('Servidor no encontrado', undefined, {
      duration: 2000,
      panelClass: 'warn-snackbar',
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }

  /**
   * Shows a snackbar depends on the error
   * @function serverPetition
   * @param {HttpErrorResponse} error The HttpErrorResponse
   * @param {[{ errorMessage: string; snackbarMessage: string }]?} forbiddenErrors The forbidden error messages and the error message for the snackbar
   * @returns {boolean} `true`: the error was displayed, `false`: the error was not displayed (unknown error)
   */
  serverPetition(
    error: HttpErrorResponse,
    forbiddenErrors?: { errorMessage: string; snackbarMessage: string }[]
  ): boolean {
    if (error.status == 401) {
      this.unauthorizedException();
    } else if (error.status == 403 && forbiddenErrors) {
      const message: ServerExceptionResponse = error.error;
      this.forbiddenException(message.exception, forbiddenErrors);
    } else if (error.status == 404) {
      this.pageNotFound();
    } else if (error.status == 500) {
      const message: ServerExceptionResponse = error.error;
      this.serverException(message.exception);
    } else {
      return false;
    }
    return true;
  }

  /**
   * Shows a snackbar depends on the error in the log in page
   * @function serverPetitionLogIn
   * @param {HttpErrorResponse} error The HttpErrorResponse
   * @returns {boolean} `true`: the error was displayed, `false`: the error was not displayed (unknown error)
   */
  serverPetitionLogIn(error: HttpErrorResponse): boolean {
    if (error.status == 401) {
      this.snackBar.open('Usuario o Contraseña incorrecto', undefined, {
        duration: 2000,
        panelClass: 'accent-snackbar',
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
    } else return this.serverPetition(error);
    return true;
  }
}
