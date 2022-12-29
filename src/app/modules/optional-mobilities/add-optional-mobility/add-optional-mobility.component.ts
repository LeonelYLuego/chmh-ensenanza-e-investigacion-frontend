import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PATHS } from '@core/constants';
import {
  Hospital,
  RotationService,
  Specialty,
  Student,
} from '@data/interfaces';
import {
  HospitalsService,
  OptionalMobilitiesService,
  RotationServicesService,
  SpecialtiesService,
  StudentsService,
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

/** Add Optional Mobility component */
@Component({
  selector: 'app-add-optional-mobility',
  templateUrl: './add-optional-mobility.component.html',
  styleUrls: ['./add-optional-mobility.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddOptionalMobilityComponent implements OnInit {
  loading = false;
  optionalMobilityFormControl = new FormGroup({
    specialty: new FormControl<undefined | string>(undefined, [
      Validators.required,
    ]),
    generation: new FormControl<undefined | number>(
      { value: undefined, disabled: true },
      [Validators.required]
    ),
    student: new FormControl<undefined | string>(
      { value: undefined, disabled: true },
      [Validators.required]
    ),
    initialDate: new FormControl<undefined | Date>(undefined, [
      Validators.required,
    ]),
    finalDate: new FormControl<undefined | Date>(undefined, [
      Validators.required,
    ]),
    hospital: new FormControl<undefined | string>(undefined, [
      Validators.required,
    ]),
    rotationService: new FormControl<undefined | string>(
      { value: undefined, disabled: true },
      [Validators.required]
    ),
  });
  specialties: Specialty[] = [];
  generations: { name: string; value: number }[] = [];
  students: Student[] = [];
  hospitals: Hospital[] = [];
  rotationServices: RotationService[] = [];

  constructor(
    private optionalMobilitiesService: OptionalMobilitiesService,
    private specialtiesServices: SpecialtiesService,
    private rotationServicesService: RotationServicesService,
    private studentsService: StudentsService,
    private hospitalsService: HospitalsService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    this.specialties = await this.specialtiesServices.findAll();
    this.hospitals = await this.hospitalsService.getAll();
  }

  /** If Specialty changed gets Rotation Services and Generations */
  async specialtyChanged(): Promise<void> {
    if (this.optionalMobilityFormControl.controls.specialty.valid) {
      this.generations = await this.specialtiesServices.getGenerations(
        this.optionalMobilityFormControl.controls.specialty.value!
      );
      this.rotationServices = await this.rotationServicesService.getAll(
        this.optionalMobilityFormControl.controls.specialty.value!
      );
      this.optionalMobilityFormControl.controls.generation.setValue(undefined);
      this.optionalMobilityFormControl.controls.generation.enable();
      this.optionalMobilityFormControl.controls.rotationService.setValue(
        undefined
      );
      this.optionalMobilityFormControl.controls.rotationService.enable();
      await this.generationChanged();
    }
  }

  /** If generations changed gets Students */
  async generationChanged(): Promise<void> {
    if (this.optionalMobilityFormControl.controls.generation.valid) {
      this.students = await this.studentsService.getAll(
        this.optionalMobilityFormControl.controls.specialty.value!,
        this.optionalMobilityFormControl.controls.generation.value!
      );
      this.optionalMobilityFormControl.controls.student.setValue(undefined);
      this.optionalMobilityFormControl.controls.student.enable();
    } else {
      this.optionalMobilityFormControl.controls.student.setValue(undefined);
      this.optionalMobilityFormControl.controls.student.disable();
    }
  }

  /** Sets initial date when a year and month is selected */
  setInitialMonthAndYear(
    normalizedMonthAndYear: any,
    datepicker: MatDatepicker<Moment>
  ) {
    this.optionalMobilityFormControl.controls.initialDate.setValue(
      normalizedMonthAndYear._d
    );
    datepicker.close();
  }

  /** Sets final date when a year and month is selected */
  setFinalMonthAndYear(
    normalizedMonthAndYear: any,
    datepicker: MatDatepicker<Moment>
  ) {
    this.optionalMobilityFormControl.controls.finalDate.setValue(
      normalizedMonthAndYear._d
    );
    datepicker.close();
  }

  /** Sends the information to the server to add a Optional Mobility */
  async addOptionalMobility(): Promise<void> {
    if (this.optionalMobilityFormControl.valid) {
      const value = this.optionalMobilityFormControl.value;
      if (
        await this.optionalMobilitiesService.add({
          student: value.student!,
          hospital: value.hospital!,
          initialDate: value.initialDate!,
          finalDate: new Date(
            value.finalDate!.getFullYear(),
            value.finalDate!.getMonth() + 1,
            0
          ),
          rotationService: value.rotationService!,
        })
      )
        this.router.navigate([PATHS.OPTIONAL_MOBILITIES.BASE_PATH]);
    }
  }

  /** Opens a Hospital dialog to add a Hospital */
  async addHospitalDialog(): Promise<void> {
    const dialogRef = this.dialog.open(HospitalDialogComponent, {
      maxWidth: '500px',
      width: '80%',
      position: {
        top: '10px',
      },
    });

    /** Gets again the hospitals */
    dialogRef.afterClosed().subscribe(async () => {
      this.hospitals = await this.hospitalsService.getAll();
    });
  }

  /** Opens a Rotation Service dialog to add a Rotation Service */
  async addRotationServiceDialog(): Promise<void> {
    if (this.optionalMobilityFormControl.controls.specialty.value) {
      const dialogRef = this.dialog.open(RotationServiceDialogComponent, {
        maxWidth: '500px',
        width: '80%',
        position: {
          top: '10px',
        },
        data: {
          specialty:
            this.optionalMobilityFormControl.controls.specialty.value ??
            undefined,
          disableSpecialty: true,
          incoming: false,
        },
      });

      /** Gets again the Rotation Services */
      dialogRef.afterClosed().subscribe(async () => {
        this.rotationServices = await this.rotationServicesService.getAll(
          this.optionalMobilityFormControl.controls.specialty.value!
        );
      });
    }
  }
}
