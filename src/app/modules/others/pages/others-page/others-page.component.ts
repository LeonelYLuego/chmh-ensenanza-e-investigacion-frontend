import { Component, OnInit } from '@angular/core';
import { PATHS } from '@core/constants';
import { User } from '@data/interfaces';

/** Others Page component */
@Component({
  selector: 'app-others-page',
  templateUrl: './others-page.component.html',
  styleUrls: ['./others-page.component.css'],
})
export class OthersPageComponent implements OnInit {
  administrator: boolean = false;
  paths = PATHS;

  constructor() {}

  ngOnInit(): void {
    //Checks if the current user is an administrator
    const user = JSON.parse(localStorage.getItem('user')!) as User;
    this.administrator = user.administrator;
  }
}
