import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PATHS } from '@core/constants';
import {
  IncomingStudent,
  IncomingStudentsInterval,
} from '@data/interfaces/incoming-student';
import { IncomingStudentsService } from '@data/services';

@Component({
  selector: 'app-incoming-students-page',
  templateUrl: './incoming-students-page.component.html',
  styleUrls: ['./incoming-students-page.component.css'],
})
export class IncomingStudentsPageComponent implements OnInit {
  loading = false;
  paths = PATHS.INCOMING_STUDENTS;
  interval: IncomingStudentsInterval = { initialMonths: [], finalMonths: [] };
  intervalFormControl = new FormGroup({
    initialDate: new FormControl<Date | null>(null, [Validators.required]),
    finalDate: new FormControl<Date | null>(null, [Validators.required]),
  });
  incomingStudents: IncomingStudent[] = [];
  displayedColumns = ['student', 'hospital', 'period', 'documents'];

  constructor(
    private incomingStudentsService: IncomingStudentsService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.interval = await this.incomingStudentsService.interval();
    if (
      this.interval.initialMonths.length > 0 &&
      this.interval.finalMonths.length > 0
    ) {
      this.intervalFormControl.controls.initialDate.setValue(
        this.interval.initialMonths[this.interval.initialMonths.length - 12]
          .value
      );
      this.intervalFormControl.controls.finalDate.setValue(
        this.interval.finalMonths[this.interval.finalMonths.length - 1].value
      );
      this.getIncomingStudents();
    }
  }

  async getIncomingStudents(): Promise<void> {
    this.loading = true;
    this.incomingStudents = await this.incomingStudentsService.getAll(
      this.intervalFormControl.controls.initialDate.value!,
      this.intervalFormControl.controls.finalDate.value!
    );
    this.loading = false;
  }

  getPeriod(initialDate: Date, finalDate: Date): string {
    return this.incomingStudentsService.getPeriod(
      new Date(initialDate),
      new Date(finalDate)
    );
  }

  async updateIncomingStudent(row: IncomingStudent) {
    this.router.navigate([this.paths.BASE_PATH, row._id!]);
  }
}
