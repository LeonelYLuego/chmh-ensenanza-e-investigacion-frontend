import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Specialty } from '@app/data/interfaces/specialty';
import { Student } from '@app/data/interfaces/student';
import { SpecialtiesService } from '@app/data/services/specialties.service';
import { StudentsService } from '@app/data/services/students.service';
import { StudentDialogComponent } from '../student-dialog/student-dialog.component';

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.css'],
})
export class StudentInfoComponent implements OnInit {
  @Input()
  id: string | Student = '';
  student: Student | null = null;
  specialty: Specialty | null = null;
  phones: string = '';
  emails: string = '';
  generation: string = '';

  constructor(
    private dialog: MatDialog,
    private studentsService: StudentsService,
    private specialtiesService: SpecialtiesService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getStudent();
  }

  async getStudent(): Promise<void> {
    this.student = await this.studentsService.getStudent(this.id as string);
    if (this.student) {
      this.specialty = this.student.specialty as Specialty;
      this.phones = '';
      this.student.phones.map((phone) => {
        this.phones += phone + ', ';
      });
      this.phones = this.phones.slice(0, -2);
      this.emails = '';
      this.student.emails.map((email) => {
        this.emails += email + ', ';
      });
      this.emails = this.emails.slice(0, -2);
      this.generation = await this.specialtiesService.getGeneration(
        this.specialty._id!,
        this.student.lastYearGeneration
      );
    }
  }

  updateStudentDialog(): void {
    const dialogRef = this.dialog.open(StudentDialogComponent, {
      maxWidth: '500px',
      width: '80%',
      position: {
        top: '10px',
      },
      data: {
        student: this.student,
      },
    });

    dialogRef.afterClosed().subscribe(async () => {
      await this.getStudent();
    });
  }
}
