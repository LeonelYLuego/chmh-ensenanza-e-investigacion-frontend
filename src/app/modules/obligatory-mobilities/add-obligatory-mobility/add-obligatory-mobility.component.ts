import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
import { Router } from '@angular/router';
import { PATHS } from '@core/constants';
import { monthToString } from '@core/functions/date.function';
import {
  Hospital,
  RotationService,
  Specialty,
  Student,
} from '@data/interfaces';
import {
  HospitalsService,
  ObligatoryMobilitiesService,
  RotationServicesService,
  SpecialtiesService,
  StudentsService,
} from '@data/services';
import { Moment } from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11Label: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-obligatory-mobility',
  templateUrl: './add-obligatory-mobility.component.html',
  styleUrls: ['./add-obligatory-mobility.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_FORMATS,
    },
  ],
})
export class AddObligatoryMobilityComponent implements OnInit {
  loading = false;
  filtersFormControl = new FormGroup({
    specialty: new FormControl<string>('', [Validators.required]),
    generation: new FormControl<number>({ value: NaN, disabled: true }, [
      Validators.required,
    ]),
    initialDate: new FormControl<undefined | Date>(undefined, [
      Validators.required,
    ]),
    finalDate: new FormControl<undefined | Date>(undefined, [
      Validators.required,
    ]),
  });
  specialties: Specialty[] = [];
  generations: { name: string; value: number }[] = [];
  rotationServices: RotationService[] = [];
  hospitals: Hospital[] = [];
  students: Student[] = [];
  obligatoryMobilities: {
    student: FormControl<string | null>;
    months: {
      value: { month: number; year: number };
      hospital: FormControl<string | null>;
      rotationService: FormControl<string | null>;
    }[];
  }[] = [];

  constructor(
    private obligatoryMobilitiesService: ObligatoryMobilitiesService,
    private specialtiesService: SpecialtiesService,
    private studentsService: StudentsService,
    private hospitalsService: HospitalsService,
    private rotationServicesService: RotationServicesService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.specialties = await this.specialtiesService.findAll();
    this.hospitals = await this.hospitalsService.getAll();
  }

  setInitialMonthAndYear(
    normalizedMonthAndYear: any,
    datepicker: MatDatepicker<Moment>
  ) {
    this.filtersFormControl.controls.initialDate.setValue(
      normalizedMonthAndYear._d
    );
    datepicker.close();
  }

  setFinalMonthAndYear(
    normalizedMonthAndYear: any,
    datepicker: MatDatepicker<Moment>
  ) {
    this.filtersFormControl.controls.finalDate.setValue(
      normalizedMonthAndYear._d
    );
    datepicker.close();
  }

  async getGenerationsAndRotationServices(): Promise<void> {
    if (this.filtersFormControl.controls.specialty.valid) {
      this.filtersFormControl.controls.generation.setValue(NaN);
      this.generations = await this.specialtiesService.getGenerations(
        this.filtersFormControl.controls.specialty.value!
      );
      this.filtersFormControl.controls.generation.enable();
      this.rotationServices = await this.rotationServicesService.getAll(
        this.filtersFormControl.controls.specialty.value!
      );
      this.students = [];
      this.obligatoryMobilities = [];
    }
  }

  async getStudents(): Promise<void> {
    if (this.filtersFormControl.valid) {
      const values = this.filtersFormControl.value;
      this.students = await this.studentsService.getAll(
        values.specialty!,
        values.generation!
      );
      this.obligatoryMobilities = [];
    }
  }

  async dateChanged(): Promise<void> {
    if (this.obligatoryMobilities.length == 0) this.getStudents();
    else {
      this.obligatoryMobilities.map((student) => {
        student.months.map((month) => {});
      });
    }
  }

  getMontAndYearAsString(month: number, year: number): string {
    let monthString = monthToString(month);
    monthString = monthString.charAt(0).toUpperCase() + monthString.slice(1);
    return `${monthString} de ${year}`;
  }

  addStudent(): void {
    if (this.filtersFormControl.valid) {
      const values = this.filtersFormControl.value;
      const months: {
        value: { month: number; year: number };
        hospital: FormControl<string | null>;
        rotationService: FormControl<string | null>;
      }[] = [];
      for (
        let year = values.initialDate!.getFullYear();
        year <= values.finalDate!.getFullYear();
        year++
      ) {
        for (let month = 0; month < 12; month++) {
          if (
            year == values.initialDate!.getFullYear() &&
            month < values.initialDate!.getMonth()
          )
            month = values.initialDate!.getMonth();
          if (
            year == values.finalDate!.getFullYear() &&
            month > values.finalDate!.getMonth()
          )
            break;
          months.push({
            value: {
              month,
              year,
            },
            rotationService: new FormControl('', [Validators.required]),
            hospital: new FormControl('', [Validators.required]),
          });
        }
      }
      this.obligatoryMobilities.push({
        student: new FormControl('', [Validators.required]),
        months,
      });
    }
  }

  removeStudent(index: number): void {
    this.obligatoryMobilities.splice(index, 1);
  }

  async addObligatoryMobility(): Promise<void> {
    let valid = true;
    this.obligatoryMobilities.map((student) => {
      student.student.markAsTouched();
      if (student.student.invalid) valid = false;
      student.months.map((month) => {
        month.hospital.markAllAsTouched();
        if (month.hospital.invalid) valid = false;
        month.rotationService.markAllAsTouched();
        if (month.rotationService.invalid) valid = false;
      });
    });
    if (valid) {
      await Promise.all(
        this.obligatoryMobilities.map(async (student) => {
          await Promise.all(
            student.months.map(async (month) => {
              this.obligatoryMobilitiesService.add({
                date: new Date(month.value.year, month.value.month, 1),
                hospital: month.hospital.value!,
                rotationService: month.rotationService.value!,
                student: student.student.value!,
              });
            })
          );
        })
      );
      this.router.navigate([PATHS.OBLIGATORY_MOBILITIES.BASE_PATH]);
    }
  }
}
