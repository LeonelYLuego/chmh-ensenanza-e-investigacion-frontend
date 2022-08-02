import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { URL } from './core/constants/urls.constant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  navigation = false;

  constructor(private router: Router) {
    router.events.subscribe((event) => {
      if(event instanceof NavigationEnd) {
        this.navigation = event.url != `/${URL.LOG_IN}`;
      }
    });
  }
}
