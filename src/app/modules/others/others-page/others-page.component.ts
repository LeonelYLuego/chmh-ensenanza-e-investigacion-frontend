import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { URL } from '@app/core/constants/urls.constant';
import { User } from '@app/data/interfaces/user';

@Component({
  selector: 'app-others-page',
  templateUrl: './others-page.component.html',
  styleUrls: ['./others-page.component.css'],
})
export class OthersPageComponent implements OnInit {
  administrator: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!) as User;
    this.administrator = user.administrator;
  }

  user() {
    this.router.navigate([URL.OTHERS.USERS])
  }
}
