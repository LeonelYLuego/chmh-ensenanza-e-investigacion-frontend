import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PATHS } from '@core/constants';
import {
  getFirstDayOfMonthAsString,
  getLastDayOfMonthAsString,
} from '@core/functions/date.function';
import { RotationService, Specialty } from '@data/interfaces';
import { IncomingStudent } from '@data/interfaces/incoming-student';
import { IncomingStudentsService } from '@data/services';

@Component({
  selector: 'app-incoming-student-info',
  templateUrl: './incoming-student-info.component.html',
  styleUrls: ['./incoming-student-info.component.css'],
})
export class IncomingStudentInfoComponent implements OnInit {
  @Input()
  id: string | IncomingStudent = '';
  incomingStudent: IncomingStudent | null = null;
  specialty: Specialty | null = null;
  rotationService: RotationService | null = null;
  incomingSpecialty: Specialty | null = null;
  phones: string = '';
  emails: string = '';
  initialDate: string = '';
  finalDate: string = '';
  year: string = '';

  constructor(
    private incomingStudentsService: IncomingStudentsService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getIncomingStudent();
  }

  async getIncomingStudent(): Promise<void> {
    if ((this.id as IncomingStudent)._id)
      this.id = (this.id as IncomingStudent)._id!;
    this.incomingStudent = await this.incomingStudentsService.get(
      this.id as string
    );
    if (this.incomingStudent) {
      this.phones = this.emails = '';
      this.incomingStudent.phones.map((phone) => {
        this.phones += phone + ', ';
      });
      this.phones = this.phones.slice(0, -2);
      this.incomingStudent.emails.map((email) => {
        this.emails += email + ', ';
      });
      this.emails = this.emails.slice(0, -2);
      this.rotationService = this.incomingStudent
        .rotationService as RotationService;
      this.specialty = this.rotationService.specialty as Specialty;
      this.incomingSpecialty = this.incomingStudent
        .incomingSpecialty as Specialty;
      this.initialDate = getFirstDayOfMonthAsString(
        new Date(this.incomingStudent.initialDate)
      );
      this.finalDate = getLastDayOfMonthAsString(
        new Date(this.incomingStudent.finalDate)
      );
      this.year = `${this.incomingStudent.incomingYear} año`;
    }
  }

  updateIncomingStudent(): void {
    this.router.navigate([
      PATHS.INCOMING_STUDENTS.BASE_PATH,
      PATHS.INCOMING_STUDENTS.UPDATE,
      this.incomingStudent!._id!,
    ]);
  }
}
