import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpResponseError } from '@core/interfaces/http-response.interface';

/** Exception Snackbar service */
@Injectable({
  providedIn: 'root',
})
export class ExceptionSnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  /** Show a snackbar with a server error message */
  private serverException(message: string) {
    this.snackBar.open(`Error del servidor: ${message}`, undefined, {
      duration: 2000,
      panelClass: 'warn-snackbar',
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }

  /**
   * Show a snackbar with a message
   * @param message message of the forbidden error
   * @param forbiddenErrors possible message errors and its message to show
   */
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

  /** Show a snackbar with a unauthorized message */
  private unauthorizedException() {
    this.snackBar.open('Petición no autorizada', undefined, {
      duration: 2000,
      panelClass: 'warn-snackbar',
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }

  /** Show a snackbar with a server not found message */
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
    error: HttpResponseError,
    forbiddenErrors?: { errorMessage: string; snackbarMessage: string }[]
  ): boolean {
    switch (error.statusCode) {
      case 401:
        this.unauthorizedException();
        break;
      case 403:
        if (forbiddenErrors) {
          const message = error.exception;
          this.forbiddenException(message, forbiddenErrors);
        }
        break;
      case 404:
        this.pageNotFound();
        break;
      case 500:
        const message = error.exception;
        this.serverException(message.exception);
        break;
      default:
        return false;
    }
    return true;
  }

  /**
   * Shows a snackbar depends on the error in the log in page
   * @function serverPetitionLogIn
   * @param {HttpResponseError} error The HttpErrorResponse
   * @returns {boolean} `true`: the error was displayed, `false`: the error was not displayed (unknown error)
   */
  serverPetitionLogIn(error: HttpResponseError): boolean {
    if (error.statusCode == 401) {
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
