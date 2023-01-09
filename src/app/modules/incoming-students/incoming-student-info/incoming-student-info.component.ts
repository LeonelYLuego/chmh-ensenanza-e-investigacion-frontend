import { Component, Input, OnInit } from '@angular/core';
import { Specialty } from '@data/interfaces';
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
  phones: string = '';
  emails: string = '';

  constructor(private incomingStudentsService: IncomingStudentsService) {}

  async ngOnInit(): Promise<void> {
    await this.getIncomingStudent();
  }

  async getIncomingStudent(): Promise<void> {
    console.log(this.id);
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
    }
  }
}
