import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { URL } from '@app/core/constants/urls.constant';
import { UserService } from '@app/data/services/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  constructor(private router: Router, private userService: UserService) {}

  logOut(): void {
    this.userService.logOut();
  }

  others(): void {
    this.router.navigate([URL.OTHERS.BASE])
  }

  ngOnInit(): void {}
}
