import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PATHS } from '@core/constants';
import { Hospital, RotationService, Specialty } from '@data/interfaces';
import { IncomingStudent } from '@data/interfaces/incoming-student';
import {
  HospitalsService,
  IncomingStudentsService,
  RotationServicesService,
  SpecialtiesService,
} from '@data/services';
import { HospitalDialogComponent } from '@shared/hospital-dialog';
import { IncomingSpecialtyDialogComponent } from '@shared/incoming-specialty-dialog';
import { RotationServiceDialogComponent } from '@shared/rotation-service-dialog';
import { Moment } from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

/** Add Update Incoming Student component */
@Component({
  selector: 'app-add-update-incoming-student',
  templateUrl: './add-update-incoming-student.component.html',
  styleUrls: ['./add-update-incoming-student.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddUpdateIncomingStudentComponent implements OnInit {
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
  incomingStudentFormControl = new FormGroup({
    name: new FormControl('', this.nameValidators),
    firstLastName: new FormControl('', this.nameValidators),
    secondLastName: new FormControl('', this.nameOptionalValidators),
    code: new FormControl('', [Validators.maxLength(64)]),
    phones: new FormArray<FormControl<string | null>>([]),
    emails: new FormArray<FormControl<string | null>>([]),
    hospital: new FormControl<string | null>(null, Validators.required),
    specialty: new FormControl<string | null>(null, Validators.required),
    rotationService: new FormControl<string | null>(
      { value: null, disabled: true },
      Validators.required
    ),
    incomingSpecialty: new FormControl<string | null>(
      null,
      Validators.required
    ),
    incomingYear: new FormControl<null | number>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(6),
      Validators.pattern(/^\d+$/),
    ]),
    initialDate: new FormControl<null | Date>(null, [Validators.required]),
    finalDate: new FormControl<null | Date>(null, [Validators.required]),
  });
  loading = false;
  hospitals: Hospital[] = [];
  specialties: Specialty[] = [];
  rotationServices: RotationService[] = [];
  incomingStudent?: IncomingStudent;
  incomingSpecialties: Specialty[] = [];

  constructor(
    private incomingStudentsService: IncomingStudentsService,
    private hospitalsService: HospitalsService,
    private specialtiesService: SpecialtiesService,
    private rotationServicesService: RotationServicesService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    this.hospitals = await this.hospitalsService.getAll();
    this.specialties = await this.specialtiesService.findAll();
    this.incomingSpecialties = await this.specialtiesService.findAll(true);
    // Checks if the _id param is valid
    this.route.params.subscribe(async (params) => {
      const _id = params['_id'];
      if (_id) {
        if (/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(_id)) {
          await this.setIncomingStudent(_id);
        } else
          this.router.navigate([
            PATHS.ERROR.BASE_PATH,
            PATHS.ERROR.PAGE_NOT_FOUND,
          ]);
      }
    });
  }

  /** Sets int the form control the Incoming Student */
  async setIncomingStudent(_id: string): Promise<void> {
    this.incomingStudent =
      (await this.incomingStudentsService.get(_id)) ?? undefined;
    if (this.incomingStudent) {
      this.incomingStudentFormControl.setValue({
        code: this.incomingStudent.code ?? '',
        finalDate: new Date(this.incomingStudent.finalDate),
        firstLastName: this.incomingStudent.firstLastName,
        hospital: (this.incomingStudent.hospital as Hospital)._id!,
        initialDate: new Date(this.incomingStudent.initialDate),
        name: this.incomingStudent.name,
        rotationService: (
          this.incomingStudent.rotationService as RotationService
        )._id!,
        specialty: (
          (this.incomingStudent.rotationService as RotationService)
            .specialty as Specialty
        )._id!,
        incomingSpecialty: (this.incomingStudent.incomingSpecialty as Specialty)
          ._id!,
        incomingYear: this.incomingStudent.incomingYear!,
        secondLastName: this.incomingStudent.secondLastName ?? '',
        emails: [],
        phones: [],
      });
      this.incomingStudent.phones.map((phone) => this.addPhone(phone));
      this.incomingStudent.emails.map((email) => this.addEmail(email));
      this.incomingStudentFormControl.controls.rotationService.enable();
      this.rotationServices = await this.rotationServicesService.getAll(
        this.incomingStudentFormControl.controls.specialty.value!
      );
    }
  }

  /** If specialty changes */
  async specialtyChanged(): Promise<void> {
    this.incomingStudentFormControl.controls.rotationService.setValue('');
    this.rotationServices = await this.rotationServicesService.getAll(
      this.incomingStudentFormControl.controls.specialty.value!
    );
    this.incomingStudentFormControl.controls.rotationService.enable();
  }

  /** Adds a phone */
  addPhone(phone = ''): void {
    this.incomingStudentFormControl.controls.phones.push(
      new FormControl(phone, [
        Validators.required,
        Validators.pattern(
          /^(\+[0-9]{2})*\ {0,1}[0-9]{3}\ {0,1}[0-9]{3}\ {0,1}[0-9]{4}$/
        ),
      ])
    );
  }

  /** Deletes a phone */
  deletePhone(index: number): void {
    this.incomingStudentFormControl.controls.phones.removeAt(index);
  }

  /** Adds an email */
  addEmail(email = ''): void {
    this.incomingStudentFormControl.controls.emails.push(
      new FormControl(email, [
        Validators.required,
        Validators.email,
        Validators.minLength(3),
        Validators.maxLength(64),
      ])
    );
  }

  /** Deletes an email */
  deleteEmail(index: number): void {
    this.incomingStudentFormControl.controls.emails.removeAt(index);
  }

  /** Sets initial date when a year and month is selected */
  setFinalMonthAndYear(
    normalizedMonthAndYear: any,
    datepicker: MatDatepicker<Moment>
  ) {
    this.incomingStudentFormControl.controls.finalDate.setValue(
      normalizedMonthAndYear._d
    );
    datepicker.close();
  }

  /** Sets final date when a year and month is selected */
  setInitialMonthAndYear(
    normalizedMonthAndYear: any,
    datepicker: MatDatepicker<Moment>
  ) {
    this.incomingStudentFormControl.controls.initialDate.setValue(
      normalizedMonthAndYear._d
    );
    datepicker.close();
  }

  /** Add an Incoming Student to the database */
  async addIncomingStudent(): Promise<void> {
    if (this.incomingStudentFormControl.valid) {
      // Checks if the dates are valid
      const values = this.incomingStudentFormControl.value;
      const initialDate = new Date(
          values.initialDate!.getFullYear(),
          values.initialDate!.getMonth(),
          1
        ),
        finalDate = new Date(
          values.finalDate!.getFullYear(),
          values.finalDate!.getMonth() + 1,
          0
        );
      if (finalDate.getTime() < initialDate.getTime()) {
        this.incomingStudentFormControl.controls.initialDate.setErrors({
          invalid: true,
        });
        this.incomingStudentFormControl.controls.finalDate.setErrors({
          invalid: true,
        });
      } else {
        this.loading = true;
        const data = await this.incomingStudentsService.add({
          name: values.name!,
          firstLastName: values.firstLastName!,
          secondLastName:
            values.secondLastName == '' || null
              ? undefined
              : (values.secondLastName as string),
          code: values.code == '' || null ? undefined : (values.code as string),
          phones: values.phones?.map((phone) => phone) as string[],
          emails: values.emails?.map((email) => email) as string[],
          hospital: values.hospital!,
          rotationService: values.rotationService!,
          incomingSpecialty: values.incomingSpecialty!,
          incomingYear: values.incomingYear!,
          initialDate: values.initialDate!,
          finalDate: values.finalDate!,
        });
        if (data) this.router.navigate([PATHS.INCOMING_STUDENTS.BASE_PATH]);
        this.loading = false;
      }
    }
  }

  /** Updates a Incoming Student in the database */
  async updateIncomingStudent(): Promise<void> {
    if (this.incomingStudentFormControl.valid) {
      // Checks if the dates are valid
      const values = this.incomingStudentFormControl.value;
      const initialDate = new Date(
          values.initialDate!.getFullYear(),
          values.initialDate!.getMonth(),
          1
        ),
        finalDate = new Date(
          values.finalDate!.getFullYear(),
          values.finalDate!.getMonth() + 1,
          0
        );
      if (finalDate.getTime() < initialDate.getTime()) {
        this.incomingStudentFormControl.controls.initialDate.setErrors({
          invalid: true,
        });
        this.incomingStudentFormControl.controls.finalDate.setErrors({
          invalid: true,
        });
      } else {
        this.loading = true;
        const data = await this.incomingStudentsService.update(
          this.incomingStudent!._id!,
          {
            name: values.name!,
            firstLastName: values.firstLastName!,
            secondLastName:
              values.secondLastName == '' || null
                ? undefined
                : (values.secondLastName as string),
            code:
              values.code == '' || null ? undefined : (values.code as string),
            phones: values.phones?.map((phone) => phone) as string[],
            emails: values.emails?.map((email) => email) as string[],
            hospital: values.hospital!,
            rotationService: values.rotationService!,
            incomingSpecialty: values.incomingSpecialty!,
            incomingYear: values.incomingYear!,
            initialDate: values.initialDate!,
            finalDate: values.finalDate!,
          }
        );
        if (data)
          this.router.navigate([
            PATHS.INCOMING_STUDENTS.BASE_PATH,
            this.incomingStudent!._id!,
          ]);
        this.loading = false;
      }
    }
  }

  /** Returns to the last page */
  goBack() {
    this.router.navigate([
      PATHS.INCOMING_STUDENTS.BASE_PATH,
      this.incomingStudent!._id!,
    ]);
  }

  /** Opens the Hospital dialog to add a new Hospital  */
  async addHospitalDialog(): Promise<void> {
    const dialogRef = this.dialog.open(HospitalDialogComponent, {
      maxWidth: '500px',
      width: '80%',
      position: {
        top: '10px',
      },
    });

    dialogRef.afterClosed().subscribe(async () => {
      this.hospitals = await this.hospitalsService.getAll();
    });
  }

  /** Opens the Rotation Service dialog to add a new Rotation Service */
  async addRotationServiceDialog(): Promise<void> {
    if (this.incomingStudentFormControl.controls.specialty.value) {
      const dialogRef = this.dialog.open(RotationServiceDialogComponent, {
        maxWidth: '500px',
        width: '80%',
        position: {
          top: '10px',
        },
        data: {
          specialty:
            this.incomingStudentFormControl.controls.specialty.value ??
            undefined,
          disableSpecialty: true,
          incoming: true,
        },
      });

      dialogRef.afterClosed().subscribe(async () => {
        this.rotationServices = await this.rotationServicesService.getAll(
          this.incomingStudentFormControl.controls.specialty.value!
        );
      });
    }
  }

  /** Opens the Incoming Specialty dialog to add a new specialty */
  async addIncomingSpecialtyDialog(): Promise<void> {
    const dialogRef = this.dialog.open(IncomingSpecialtyDialogComponent, {
      maxWidth: '500px',
      width: '80%',
      position: { top: '10px' },
      data: {},
    });

    dialogRef.afterClosed().subscribe(async () => {
      this.incomingSpecialties = await this.specialtiesService.findAll(true);
    });
  }
}
