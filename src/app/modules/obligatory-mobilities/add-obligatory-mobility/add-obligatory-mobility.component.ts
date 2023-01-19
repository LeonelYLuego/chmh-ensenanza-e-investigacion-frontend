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
import { Moment } from 'moment';
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
import { Router } from '@angular/router';
import { PATHS } from '@core/constants';

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
    specialty: new FormControl('', [Validators.required]),
    generation: new FormControl<undefined | number>(
      { value: undefined, disabled: true },
      [Validators.required]
    ),
  });
  studentsFormControl: FormArray<
    FormGroup<{
      student: FormControl<string | null>;
      hospitals: FormArray<
        FormGroup<{
          hospital: FormControl<string | null>;
          initialDate: FormControl<Date | null>;
          finalDate: FormControl<Date | null>;
          rotationService: FormControl<string | null>;
        }>
      >;
    }>
  > = new FormArray<
    FormGroup<{
      student: FormControl<string | null>;
      hospitals: FormArray<
        FormGroup<{
          hospital: FormControl<string | null>;
          initialDate: FormControl<Date | null>;
          finalDate: FormControl<Date | null>;
          rotationService: FormControl<string | null>;
        }>
      >;
    }>
  >([]);
  specialties: Specialty[] = [];
  generations: { name: string; value: number }[] = [];
  rotationServices: RotationService[] = [];
  students: Student[] = [];
  hospitals: Hospital[] = [];

  constructor(
    private obligatoryMobilitiesService: ObligatoryMobilitiesService,
    private specialtiesService: SpecialtiesService,
    private rotationServicesService: RotationServicesService,
    private studentsService: StudentsService,
    private hospitalsService: HospitalsService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.specialties = await this.specialtiesService.findAll();
    this.hospitals = await this.hospitalsService.getAll();
  }

  async specialtyChanged(): Promise<void> {
    this.filtersFormControl.controls.generation.setValue(undefined);
    this.generations = await this.specialtiesService.getGenerations(
      this.filtersFormControl.controls.specialty.value!
    );
    this.rotationServices = await this.rotationServicesService.getAll(
      this.filtersFormControl.controls.specialty.value!
    );
    this.filtersFormControl.controls.generation.enable();
    this.generationChanged();
  }

  async generationChanged(): Promise<void> {
    this.studentsFormControl.clear();
    if (this.filtersFormControl.valid) {
      this.students = await this.studentsService.getAll(
        this.filtersFormControl.controls.specialty.value!,
        this.filtersFormControl.controls.generation.value!
      );
    } else this.students = [];
  }

  addStudent(): void {
    this.studentsFormControl.push(
      new FormGroup({
        student: new FormControl('', [Validators.required]),
        hospitals: new FormArray([
          new FormGroup({
            hospital: new FormControl('', [Validators.required]),
            initialDate: new FormControl<Date | null>(null, [
              Validators.required,
            ]),
            finalDate: new FormControl<Date | null>(null, [
              Validators.required,
            ]),
            rotationService: new FormControl('', [Validators.required]),
          }),
        ]),
      })
    );
  }

  deleteStudent(studentIndex: number): void {
    this.studentsFormControl.removeAt(studentIndex);
  }

  addHospital(studentIndex: number): void {
    this.studentsFormControl.controls[studentIndex].controls.hospitals.push(
      new FormGroup({
        hospital: new FormControl('', [Validators.required]),
        initialDate: new FormControl<Date | null>(null, [Validators.required]),
        finalDate: new FormControl<Date | null>(null, [Validators.required]),
        rotationService: new FormControl('', [Validators.required]),
      })
    );
  }

  deleteHospital(studentIndex: number, hospitalIndex: number): void {
    this.studentsFormControl.controls[studentIndex].controls.hospitals.removeAt(
      hospitalIndex
    );
  }

  setInitialMonthAndYear(
    normalizedMonthAndYear: any,
    datepicker: MatDatepicker<Moment>,
    studentIndex: number,
    hospitalIndex: number
  ) {
    this.studentsFormControl.controls[studentIndex].controls.hospitals.controls[
      hospitalIndex
    ].controls.initialDate.setValue(normalizedMonthAndYear._d);
    datepicker.close();
  }

  setFinalMonthAndYear(
    normalizedMonthAndYear: any,
    datepicker: MatDatepicker<Moment>,
    studentIndex: number,
    hospitalIndex: number
  ) {
    this.studentsFormControl.controls[studentIndex].controls.hospitals.controls[
      hospitalIndex
    ].controls.finalDate.setValue(normalizedMonthAndYear._d);
    datepicker.close();
  }

  async addObligatoryMobility(): Promise<void> {
    if (this.studentsFormControl.valid) {
      let valid = true;
      this.studentsFormControl.controls.map((studentFormControl) => {
        studentFormControl.controls.hospitals.controls.map(
          (hospitalFormControl) => {
            const values = hospitalFormControl.value;
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
              hospitalFormControl.controls.initialDate.setErrors({
                invalid: true,
              });
              hospitalFormControl.controls.finalDate.setErrors({
                invalid: true,
              });
              valid = false;
            }
          }
        );
      });
      if (valid) {
        this.loading = true;
        const values = this.studentsFormControl.value;
        await Promise.all(
          values.map(async (student) => {
            await Promise.all(
              student.hospitals!.map(async (hospital) => {
                const initialDate = new Date(
                    hospital.initialDate!.getFullYear(),
                    hospital.initialDate!.getMonth(),
                    1
                  ),
                  finalDate = new Date(
                    hospital.finalDate!.getFullYear(),
                    hospital.finalDate!.getMonth() + 1,
                    0
                  );
                await this.obligatoryMobilitiesService.add({
                  finalDate,
                  initialDate,
                  hospital: hospital.hospital!,
                  student: student.student!,
                  rotationService: hospital.rotationService!,
                });
              })
            );
          })
        );
        this.router.navigate([PATHS.OBLIGATORY_MOBILITIES.BASE_PATH]);
        this.loading = false;
      }
    }
  }
}
