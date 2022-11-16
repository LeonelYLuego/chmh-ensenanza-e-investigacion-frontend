import { Component, OnInit } from '@angular/core';
import { PATHS } from '@core/constants';

@Component({
  selector: 'app-optional-mobilities-page',
  templateUrl: './optional-mobilities-page.component.html',
  styleUrls: ['./optional-mobilities-page.component.css'],
})
export class OptionalMobilitiesPageComponent implements OnInit {
  loading = false;
  paths = PATHS.OPTIONAL_MOBILITIES

  constructor() {}

  ngOnInit(): void {}
}
