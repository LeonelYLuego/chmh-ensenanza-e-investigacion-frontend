import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PATHS } from '@app/core/constants/paths.constant';
import { UsersService } from '@app/data/services/users.service';

/** @class Navigation Top Bar Component */
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  constructor(private router: Router, private usersService: UsersService) {}

  /**
   * Log Out
   * @function logOut
   */
  logOut(): void {
    this.usersService.logOut();
  }

  /**
   * Opens the Others page
   * @funcntion others
   */
  others(): void {
    this.router.navigate([PATHS.OTHERS.BASE]);
  }

  ngOnInit(): void {}
}
