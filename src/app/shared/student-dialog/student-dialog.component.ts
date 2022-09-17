import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Specialty } from '@app/data/interfaces/specialty';
import { Student } from '@app/data/interfaces/student';
import { SpecialtiesService } from '@app/data/services/specialties.service';
import { StudentsService } from '@app/data/services/students.service';

@Component({
  selector: 'app-student-dialog',
  templateUrl: './student-dialog.component.html',
  styleUrls: ['./student-dialog.component.css'],
})
/** @Class Student Dialog Component  */
export class StudentDialogComponent implements OnInit {
  readonly nameValidators = [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(64),
    Validators.pattern(/^[a-zA-ZáéíóúüñÁÉÍÓÚÑ ]+$/u),
  ];
  readonly nameOptionalValidators = [
    Validators.minLength(3),
    Validators.maxLength(64),
    Validators.pattern(/^[a-zA-ZáéíóúüñÁÉÍÓÚÑ ]+$/u),
  ];
  specialties: Specialty[] = [];
  generations: { name: string; value: number }[] = [];

  //Studen Form Control
  studentFormControl = new FormGroup({
    name: new FormControl('', this.nameValidators),
    firstLastname: new FormControl('', this.nameValidators),
    secondLastname: new FormControl('', this.nameOptionalValidators),
    code: new FormControl('', [Validators.maxLength(64)]),
    specialty: new FormControl<string | null>(null, Validators.required),
    lastYearGeneration: new FormControl<number | null>(
      null,
      Validators.required
    ),
    phones: new FormArray<FormControl<string | null>>([]),
    emails: new FormArray<FormControl<string | null>>([]),
  });

  constructor(
    private dialogRef: MatDialogRef<StudentDialogComponent>,
    private studentsService: StudentsService,
    private specialtiesService: SpecialtiesService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      specialty: string | null;
      lastYearGeneration: number | null;
      student: Student | undefined;
    }
  ) {}

  async ngOnInit(): Promise<void> {
    // Get specialties
    this.specialties = await this.specialtiesService.getSpecialties();

    // Get generation
    this.generations = await this.specialtiesService.getGenerations(''); //////////////////////////////////// Modify

    //Checks if the user wants to edit a student
    if (this.data.student) {
      const student = this.data.student;
      this.studentFormControl.setValue({
        code: student.code ?? null,
        firstLastname: student.firstLastName,
        name: student.name,
        secondLastname: student.secondLastName ?? '',
        specialty: (student.specialty as Specialty)._id!,
        lastYearGeneration: student.lastYearGeneration,
        phones: [],
        emails: [],
      });
      student.phones.map((phone) => {
        this.addPhone(phone);
      });
      student.emails.map((email) => {
        this.addEmail(email);
      });
    } else {
      // Selects a specialty if is no specified in the data of the dialog
      if (
        this.data.specialty &&
        this.specialties.findIndex(
          (specialty) => specialty._id == this.data.specialty
        ) != -1
      ) {
        this.studentFormControl.controls.specialty.setValue(
          this.data.specialty
        );
      } else if (this.specialties.length > 0)
        this.studentFormControl.controls.specialty.setValue(
          this.specialties[0]._id!
        );
      if (
        this.data.lastYearGeneration &&
        this.generations.find(
          (generation) => generation.value == this.data.lastYearGeneration
        )
      ) {
        this.studentFormControl.controls.lastYearGeneration.setValue(
          this.data.lastYearGeneration
        );
      } else if (this.generations.length > 0) {
        this.studentFormControl.controls.lastYearGeneration.setValue(
          this.generations[0].value
        );
      }
    }
  }

  /**
   * Adds a Phone Form Control to the dialog
   * @param {string} phone initial phone value
   */
  addPhone(phone: string = ''): void {
    this.studentFormControl.controls.phones.push(
      new FormControl(phone, [
        Validators.required,
        Validators.pattern(
          /^(\+[0-9]{2})*\ {0,1}[0-9]{3}\ {0,1}[0-9]{3}\ {0,1}[0-9]{4}$/
        ),
      ])
    );
  }

  /**
   * Deletes the specified Phone Form Control at the index
   * @param {number} index
   */
  deletePhone(index: number): void {
    this.studentFormControl.controls.phones.removeAt(index);
  }

  /**
   * Adds Email Form Control to the dialog
   * @param {string} email initial email value
   */
  addEmail(email: string = ''): void {
    this.studentFormControl.controls.emails.push(
      new FormControl(email, [
        Validators.required,
        Validators.email,
        Validators.minLength(3),
        Validators.maxLength(64),
      ])
    );
  }

  /**
   * Deletes the specified Phone Form Control at the index
   * @param {number} index
   */
  deleteEmail(index: number): void {
    this.studentFormControl.controls.emails.removeAt(index);
  }

  /**
   * Sends the dialog data for add a Student
   * @async
   */
  async addStudent(): Promise<void> {
    if (this.studentFormControl.valid) {
      const data = this.studentFormControl.value;
      const user = await this.studentsService.addStudent({
        code: data.code == '' ? undefined : data.code!,
        name: data.name!,
        firstLastName: data.firstLastname!,
        secondLastName: data.secondLastname == '' ? undefined : data.secondLastname!,
        specialty: data.specialty!,
        lastYearGeneration: data.lastYearGeneration!,
        phones: data.phones as string[],
        emails: data.emails as string[],
      });
      if (user) {
        this.close();
      }
    }
  }

  /**
   * Sends the dialog data for update a specified Student
   * @async
   */
  async updateStudent(): Promise<void> {
    if (this.studentFormControl.valid) {
      const data = this.studentFormControl.value;
      const user = await this.studentsService.updateStudent(
        this.data.student?._id!,
        {
          code: data.code == '' ? undefined : data.code!,
          name: data.name!,
          firstLastName: data.firstLastname!,
          secondLastName: data.secondLastname == '' ? undefined : data.secondLastname!,
          specialty: data.specialty!,
          lastYearGeneration: data.lastYearGeneration!,
          phones: data.phones as string[],
          emails: data.emails as string[],
        }
      );
      if (user) {
        this.close();
      }
    }
  }

  /**
   * Closes the dialog
   */
  close(): void {
    this.dialogRef.close();
  }
}
