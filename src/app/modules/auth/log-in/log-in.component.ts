import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { LogInService } from './log-in.service';

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
export class LogInComponent implements OnInit {
  user = new FormGroup({
    username: new FormControl('', [Validators.minLength(3), Validators.required]),
    password: new FormControl('', [Validators.minLength(3), Validators.required]),
  });
  matcher = new MyErrorStateMatcher();

  constructor(
    private logInService: LogInService,
  ) {}

  ngOnInit(): void {}

  logIn() {
    if(this.user.valid) {
      this.logInService.request({
        username: this.user.value.username!,
        password: this.user.value.password!,
      });
    }
  }
}
