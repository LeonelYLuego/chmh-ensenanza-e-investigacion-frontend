import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { generationService } from '@app/core/services/generation.service';
import { Specialty } from '@app/data/interfaces/specialty';
import { Student } from '@app/data/interfaces/student';
import { SpecialtiesService } from '@app/data/services/specialties.service';
import { StudentsService } from '@app/data/services/students.service';
import { StudentDialogComponent } from '@app/shared/student-dialog/student-dialog.component';

@Component({
  selector: 'app-students-page',
  templateUrl: './students-page.component.html',
  styleUrls: ['./students-page.component.css'],
})
export class StudentsPageComponent implements OnInit {
  err: any;
  loading = false;
  students: Student[] = [];
  specialties: Specialty[] = [];
  displayedColumns: string[] = ['name', 'update', 'delete'];
  specialtyFormControl = new FormControl<string | null>(null);
  generations: { name: string; value: number }[] = [];
  generationFormControl = new FormControl<number | null>(null);

  constructor(
    private studentsService: StudentsService,
    private specialtesService: SpecialtiesService,
    private generationService: generationService,
    private dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.generations = this.generationService.getGenerations();
    await this.getSpecialties();
    this.loading = false;
  }

  async getStudents(): Promise<void> {
    if (this.specialtyFormControl.value && this.generationFormControl.value)
      this.students = await this.studentsService.getStudents(
        this.specialtyFormControl.value,
        +this.generationFormControl.value
      );
  }

  async getSpecialties(): Promise<void> {
    this.specialties = await this.specialtesService.getSpecialties();
  }

  async specialtySelectionChange() {
    this.loading = true;
    await this.getStudents();
    this.loading = false;
  }

  async generationSelectionChange() {
    this.loading = true;
    await this.getStudents();
    this.loading = false;
  }

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

  async deleteStudent(_id: string): Promise<void> {
    await this.studentsService.deleteStudent(_id);
    await this.getStudents();
  }
}
