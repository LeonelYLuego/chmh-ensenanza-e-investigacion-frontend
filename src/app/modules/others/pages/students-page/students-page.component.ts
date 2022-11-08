import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Specialty, Student } from '@data/interfaces';
import { SpecialtiesService, StudentsService } from '@data/services';
import { DeleteDialogComponent } from '@shared/delete-dialog';
import { StudentDialogComponent } from '@shared/student-dialog';

@Component({
  selector: 'app-students-page',
  templateUrl: './students-page.component.html',
  styleUrls: ['./students-page.component.css'],
})
/** @class Student Page Component */
export class StudentsPageComponent implements OnInit {
  err: any;
  loading = false;
  students: Student[] = [];
  specialties: Specialty[] = [];
  displayedColumns: string[] = ['name', 'update', 'delete'];
  specialtyFormControl = new FormControl<string | null>(null);
  generations: { name: string; value: number }[] = [];
  generationFormControl = new FormControl<number | null>({
    value: null,
    disabled: true,
  });

  constructor(
    private studentsService: StudentsService,
    private specialtiesService: SpecialtiesService,
    private dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    await this.getSpecialties();
    this.loading = false;
  }

  /**
   * Gets the students from the server
   * @async
   */
  async getStudents(): Promise<void> {
    if (this.specialtyFormControl.value && this.generationFormControl.value)
      this.students = await this.studentsService.getAll(
        this.specialtyFormControl.value,
        +this.generationFormControl.value
      );
  }

  /**
   * Gets the specialties from the server
   * @async
   */
  async getSpecialties(): Promise<void> {
    this.specialties = await this.specialtiesService.findAll();
  }

  /**
   * Gets the students based of the new selected specialty
   * @async
   */
  async specialtySelectionChange(): Promise<void> {
    this.loading = true;
    this.generations = await this.specialtiesService.getGenerations(
      this.specialtyFormControl.value ?? ''
    );
    this.generationFormControl.setValue(null);
    this.students = [];
    this.generationFormControl.enable();
    this.loading = false;
  }

  /**
   * Gets the students based of the new selected generation
   * @async
   */
  async generationSelectionChange(): Promise<void> {
    this.loading = true;
    await this.getStudents();
    this.loading = false;
  }

  /**
   * Opens the Student dialog for add a Student
   */
  addStudentDialog(): void {
    const dialogRef = this.dialog.open(StudentDialogComponent, {
      maxWidth: '500px',
      width: '80%',
      position: {
        top: '10px',
      },
      data: {
        specialty: this.specialtyFormControl.value,
        lastYearGeneration: this.generationFormControl.value
          ? +this.generationFormControl.value
          : null,
      },
    });

    dialogRef.afterClosed().subscribe(async () => {
      await this.getStudents();
    });
  }

  /**
   * Opens the Student dialog for update the specified Student
   * @param {Student} student
   */
  updateStudentDialog(student: Student): void {
    const dialogRef = this.dialog.open(StudentDialogComponent, {
      maxWidth: '500px',
      width: '80%',
      position: {
        top: '10px',
      },
      data: {
        student,
      },
    });

    dialogRef.afterClosed().subscribe(async () => {
      await this.getStudents();
    });
  }

  /**
   * Deletes the specified Student in the server
   * @param {string} _id _id of the Student
   */
  async deleteStudent(_id: string, title: string): Promise<void> {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      data: `a ${title}`,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true) {
        await this.studentsService.delete(_id);
        await this.getStudents();
      }
    });
  }
}
