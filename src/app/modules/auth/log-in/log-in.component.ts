import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { PATHS } from '@app/core/constants/paths.constant';
import { UsersService } from '@app/data/services/users.service';

/** @class My Error State Matcher */
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

/** @class Log In Component */
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

  constructor(private usersService: UsersService, private router: Router) {}

  /**
   * Sends the data to log in
   * @async
   * @function logIn
   */
  async logIn(): Promise<void> {
    if (this.user.valid) {
      this.loading = true;
      const res = await this.usersService.logIn({
        username: this.user.value.username!,
        password: this.user.value.password!,
      });
      if (res) {
        this.router.navigate([PATHS.ROOT]);
      }
      this.loading = false;
    }
  }
}
