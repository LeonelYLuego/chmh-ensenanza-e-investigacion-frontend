import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PATHS } from '../constants/paths.constant';

/**  Application component */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  navigation = false;

  constructor(private router: Router) {
    // Checks if the page are in the log in to display the layout components
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.navigation =
          event.url != `/${PATHS.AUTH.BASE_PATH}/${PATHS.AUTH.LOG_IN}` &&
          event.url != `/${PATHS.AUTH.BASE_PATH}`;
      }
    });
  }
}
