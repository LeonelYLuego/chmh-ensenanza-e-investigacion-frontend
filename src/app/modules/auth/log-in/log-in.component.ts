import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { URL } from '@app/core/constants/urls.constant';
import { UserService } from '@app/data/services/user.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
})
export class LogInComponent {
  loading = false;
  user = new FormGroup({
    username: new FormControl('', [
      Validators.minLength(3),
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.minLength(3),
      Validators.required,
    ]),
  });
  matcher = new MyErrorStateMatcher();

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  async logIn(): Promise<void> {
    if (this.user.valid) {
      this.loading = true;
      try {
        const res = await this.userService.logIn({
          username: this.user.value.username!,
          password: this.user.value.password!,
        });
        if (res) {
          this.router.navigate([URL.ROOT]);
        } else {
          this.snackBar.open('Usuaro o Contraseña Incorrecto', undefined, {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: 'accent-snackbar',
          });
        }
      } catch (error) {
        console.error(error);
        this.snackBar.open('Ocurrió un Error', undefined, {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: 'warn-snackbar',
        });
      } finally {
        this.loading = false;
      }
    }
  }
}
