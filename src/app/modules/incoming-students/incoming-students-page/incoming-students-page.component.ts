import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PATHS } from '@core/constants';
import { Hospital, RotationService, Specialty } from '@data/interfaces';
import {
  IncomingStudent,
  IncomingStudentsInterval,
} from '@data/interfaces/incoming-student';
import { IncomingStudentsService } from '@data/services';

/** Incoming Student page component */
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
  incomingStudents: {
    specialty?: string;
    _id?: string;
    student?: string;
    hospital?: string;
    period?: string;
    rotationService?: string;
    incomingSpecialty?: string;
    canceled?: boolean;
    documents?: {
      solicitudeVoBo?: boolean;
      solicitudeDocument?: string;
      acceptanceDocument?: string;
      evaluationDocument?: string;
    };
  }[] = [];
  displayedColumns = [
    'student',
    'hospital',
    'rotationService',
    'period',
    'incomingSpecialty',
    'documents',
  ];

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
      let initialDateIndex = -1;
      let finalDateIndex = -1;
      if (localStorage.getItem('incomingStudentInitialDate'))
        initialDateIndex = this.interval.initialMonths.findIndex(
          (date) =>
            JSON.stringify(date.value) ==
            localStorage.getItem('incomingStudentInitialDate')
        );
      if (localStorage.getItem('incomingStudentFinalDate'))
        finalDateIndex = this.interval.finalMonths.findIndex(
          (date) =>
            JSON.stringify(date.value) ==
            localStorage.getItem('incomingStudentFinalDate')
        );
      this.intervalFormControl.controls.initialDate.setValue(
        this.interval.initialMonths[
          initialDateIndex == -1
            ? this.interval.initialMonths.length - 12
            : initialDateIndex
        ].value
      );
      this.intervalFormControl.controls.finalDate.setValue(
        this.interval.finalMonths[
          finalDateIndex == -1
            ? this.interval.finalMonths.length - 1
            : finalDateIndex
        ].value
      );
      this.getIncomingStudents();
    }
  }

  /** Sets initial date when a year and month is selected */
  initialDateChanged(): void {
    if (
      this.intervalFormControl.controls.initialDate.value!.getTime() >
      this.intervalFormControl.controls.finalDate.value!.getTime()
    ) {
      const date = this.intervalFormControl.controls.initialDate.value!;
      const index = this.interval.finalMonths.findIndex((d) => {
        return (
          d.value.getTime() ==
          new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime()
        );
      });
      this.intervalFormControl.controls.finalDate.setValue(
        this.interval.finalMonths[index].value
      );
    }
    localStorage.setItem(
      'incomingStudentInitialDate',
      JSON.stringify(this.intervalFormControl.controls.initialDate.value!)
    );
    this.getIncomingStudents();
  }

  /** Sets final date when a year and month is selected */
  finalDateChanged(): void {
    if (
      this.intervalFormControl.controls.finalDate.value!.getTime() <
      this.intervalFormControl.controls.initialDate.value!.getTime()
    ) {
      const date = this.intervalFormControl.controls.finalDate.value!;
      const index = this.interval.initialMonths.findIndex((d) => {
        return (
          d.value.getTime() ==
          new Date(date.getFullYear(), date.getMonth(), 1).getTime()
        );
      });
      this.intervalFormControl.controls.initialDate.setValue(
        this.interval.initialMonths[index].value
      );
    }
    localStorage.setItem(
      'incomingStudentFinalDate',
      JSON.stringify(this.intervalFormControl.controls.finalDate.value!)
    );
    this.getIncomingStudents();
  }

  /** Gets Incoming Students */
  async getIncomingStudents(): Promise<void> {
    this.loading = true;
    const data = await this.incomingStudentsService.getAll(
      this.intervalFormControl.controls.initialDate.value!,
      this.intervalFormControl.controls.finalDate.value!
    );
    // Clear Incoming Students
    this.incomingStudents = [];
    data.map((specialty) => {
      // Push specialties
      this.incomingStudents.push({
        specialty: specialty.value,
      });
      // Push Incoming Students
      specialty.incomingStudents.map((incomingStudent) => {
        this.incomingStudents.push({
          _id: incomingStudent._id,
          student: `${incomingStudent.name} ${incomingStudent.firstLastName} ${
            incomingStudent.secondLastName ?? ''
          }`,
          hospital: (incomingStudent.hospital as Hospital).name,
          period: this.incomingStudentsService.getPeriod(
            new Date(incomingStudent.initialDate),
            new Date(incomingStudent.finalDate)
          ),
          rotationService: (incomingStudent.rotationService as RotationService)
            .value,
          incomingSpecialty: (incomingStudent.incomingSpecialty as Specialty)
            .value,
          canceled: incomingStudent.canceled,
          documents: {
            solicitudeVoBo: incomingStudent.solicitudeVoBo,
            solicitudeDocument: incomingStudent.solicitudeDocument,
            acceptanceDocument: incomingStudent.acceptanceDocument,
            evaluationDocument: incomingStudent.evaluationDocument,
          },
        });
      });
    });
    this.loading = false;
  }

  /** Gets the period */
  getPeriod(initialDate: Date, finalDate: Date): string {
    return this.incomingStudentsService.getPeriod(
      new Date(initialDate),
      new Date(finalDate)
    );
  }

  /** Open the page to update the Incoming Student */
  async updateIncomingStudent(row: IncomingStudent) {
    if (row._id) this.router.navigate([this.paths.BASE_PATH, row._id!]);
  }
}
