import { Component, OnInit } from '@angular/core';
import { PATHS } from '@core/constants';

@Component({
  selector: 'app-incoming-students-page',
  templateUrl: './incoming-students-page.component.html',
  styleUrls: ['./incoming-students-page.component.css'],
})
export class IncomingStudentsPageComponent implements OnInit {
  loading = false;
  paths = PATHS.INCOMING_STUDENTS;

  constructor() {}

  ngOnInit(): void {}
}
