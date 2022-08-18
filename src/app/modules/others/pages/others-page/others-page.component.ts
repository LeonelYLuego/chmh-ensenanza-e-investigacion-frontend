import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PATHS } from '@app/core/constants/paths.constant';
import { User } from '@app/data/interfaces/user';

/** @class Others Page Component */
@Component({
  selector: 'app-others-page',
  templateUrl: './others-page.component.html',
  styleUrls: ['./others-page.component.css'],
})
export class OthersPageComponent implements OnInit {
  administrator: boolean = false;
  paths = PATHS;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!) as User;
    this.administrator = user.administrator;
  }
}
