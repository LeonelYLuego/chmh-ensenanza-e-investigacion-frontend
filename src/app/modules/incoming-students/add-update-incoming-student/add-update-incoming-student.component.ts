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
    initialDate: new FormControl<null | Date>(null, [Validators.required]),
    finalDate: new FormControl<null | Date>(null, [Validators.required]),
  });
  loading = false;
  hospitals: Hospital[] = [];
  specialties: Specialty[] = [];
  rotationServices: RotationService[] = [];
  incomingStudent?: IncomingStudent;

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
    this.specialties = await this.specialtiesService.findAll(true);
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

  async setIncomingStudent(_id: string): Promise<void> {
    this.incomingStudent =
      (await this.incomingStudentsService.get(_id)) ?? undefined;
    if (this.incomingStudent) {
      this.incomingStudentFormControl.setValue({
        code: this.incomingStudent.code ?? '',
        finalDate: this.incomingStudent.finalDate,
        firstLastName: this.incomingStudent.firstLastName,
        hospital: (this.incomingStudent.hospital as Hospital)._id!,
        initialDate: this.incomingStudent.initialDate,
        name: this.incomingStudent.name,
        rotationService: (
          this.incomingStudent.rotationService as RotationService
        )._id!,
        specialty: (
          (this.incomingStudent.rotationService as RotationService)
            .specialty as Specialty
        )._id!,
        secondLastName: this.incomingStudent.secondLastName ?? '',
        emails: [],
        phones: [],
      });
      this.incomingStudent.phones.map((phone) => this.addPhone(phone));
      this.incomingStudent.emails.map((email) => this.addEmail(email));
      this.incomingStudentFormControl.controls.rotationService.enable();
      this.rotationServices = await this.rotationServicesService.getAll(
        this.incomingStudentFormControl.controls.specialty.value!,
        true
      );
    }
  }

  async specialtyChanged(): Promise<void> {
    this.incomingStudentFormControl.controls.rotationService.setValue('');
    this.rotationServices = await this.rotationServicesService.getAll(
      this.incomingStudentFormControl.controls.specialty.value!,
      true
    );
    this.incomingStudentFormControl.controls.rotationService.enable();
  }

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

  deletePhone(index: number): void {
    this.incomingStudentFormControl.controls.phones.removeAt(index);
  }

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

  deleteEmail(index: number): void {
    this.incomingStudentFormControl.controls.emails.removeAt(index);
  }

  setFinalMonthAndYear(
    normalizedMonthAndYear: any,
    datepicker: MatDatepicker<Moment>
  ) {
    this.incomingStudentFormControl.controls.finalDate.setValue(
      normalizedMonthAndYear._d
    );
    datepicker.close();
  }

  setInitialMonthAndYear(
    normalizedMonthAndYear: any,
    datepicker: MatDatepicker<Moment>
  ) {
    this.incomingStudentFormControl.controls.initialDate.setValue(
      normalizedMonthAndYear._d
    );
    datepicker.close();
  }

  async addIncomingStudent(): Promise<void> {
    if (this.incomingStudentFormControl.valid) {
      this.loading = true;
      const values = this.incomingStudentFormControl.value;
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
        initialDate: values.initialDate!,
        finalDate: values.finalDate!,
      });
      if (data) this.router.navigate([PATHS.INCOMING_STUDENTS.BASE_PATH]);
      this.loading = false;
    }
  }

  async updateIncomingStudent(): Promise<void> {
    if (this.incomingStudentFormControl.valid) {
      this.loading = true;
      const values = this.incomingStudentFormControl.value;
      const data = await this.incomingStudentsService.update(
        this.incomingStudent!._id!,
        {
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

  goBack() {
    this.router.navigate([
      PATHS.INCOMING_STUDENTS.BASE_PATH,
      this.incomingStudent!._id!,
    ]);
  }

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
          this.incomingStudentFormControl.controls.specialty.value!,
          true
        );
      });
    }
  }
}
