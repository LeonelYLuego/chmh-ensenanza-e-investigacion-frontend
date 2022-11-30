import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { Moment } from 'moment';
import { PATHS } from '@core/constants';
import {
  Hospital,
  OptionalMobility,
  RotationService,
  Specialty,
} from '@data/interfaces';
import {
  HospitalsService,
  OptionalMobilitiesService,
  RotationServicesService,
  StudentsService,
} from '@data/services';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  selector: 'app-optional-mobility-student',
  templateUrl: './optional-mobility-student.component.html',
  styleUrls: ['./optional-mobility-student.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class OptionalMobilityStudentComponent implements OnInit {
  loading = false;
  optionalMobility: OptionalMobility | null = null;
  hospitals: Hospital[] = [];
  rotationServices: RotationService[] = [];
  optionalMobilityFormControl = new FormGroup({
    hospital: new FormControl<string>('', [Validators.required]),
    initialDate: new FormControl<Date>(new Date(), [Validators.required]),
    finalDate: new FormControl<Date>(new Date(), [Validators.required]),
    rotationService: new FormControl<string>('', [Validators.required]),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private optionalMobilitiesService: OptionalMobilitiesService,
    private hospitalsService: HospitalsService,
    private studentsService: StudentsService,
    private rotationServicesService: RotationServicesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      const _id = params['_id'];
      if (/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(_id)) {
        await this.getOptionalMobility(_id);
      } else
        this.router.navigate([
          PATHS.ERROR.BASE_PATH,
          PATHS.ERROR.PAGE_NOT_FOUND,
        ]);
    });
  }

  async getOptionalMobility(_id: string): Promise<void> {
    this.loading = true;
    this.optionalMobility = await this.optionalMobilitiesService.get(_id);
    if (this.optionalMobility) {
      this.hospitals = await this.hospitalsService.getAll();
      const student = await this.studentsService.get(
        this.optionalMobility.student as string
      );
      this.rotationServices = await this.rotationServicesService.getAll(
        (student!.specialty as Specialty)._id!
      );
      this.optionalMobilityFormControl.controls.hospital.setValue(
        this.optionalMobility.hospital as string
      );
      this.optionalMobilityFormControl.controls.initialDate.setValue(
        this.optionalMobility.initialDate
      );
      this.optionalMobilityFormControl.controls.finalDate.setValue(
        this.optionalMobility.finalDate
      );
      this.optionalMobilityFormControl.controls.rotationService.setValue(
        this.optionalMobility.rotationService as string
      );
      this.loading = false;
    } else
      this.router.navigate([PATHS.ERROR.BASE_PATH, PATHS.ERROR.PAGE_NOT_FOUND]);
  }

  setInitialMonthAndYear(
    normalizedMonthAndYear: any,
    datepicker: MatDatepicker<Moment>
  ): void {
    this.optionalMobilityFormControl.controls.initialDate.setValue(
      normalizedMonthAndYear._d
    );
    datepicker.close();
  }

  setFinalMonthAndYear(
    normalizedMonthAndYear: any,
    datepicker: MatDatepicker<Moment>
  ): void {
    this.optionalMobilityFormControl.controls.finalDate.setValue(
      normalizedMonthAndYear._d
    );
    datepicker.close();
  }

  async updateOptionalMobility(): Promise<void> {
    if (this.optionalMobilityFormControl.valid) {
      const values = this.optionalMobilityFormControl.value;
      values.finalDate = new Date(values.finalDate!);
      this.loading = true;
      const data = await this.optionalMobilitiesService.update(
        this.optionalMobility!._id!,
        {
          hospital: values.hospital!,
          initialDate: values.initialDate!,
          finalDate: new Date(
            values.finalDate!.getFullYear(),
            values.finalDate!.getMonth() + 1,
            0
          ),
          rotationService: values.rotationService!,
          student: this.optionalMobility!.student,
        }
      );
      if (data) {
        this.optionalMobility = data;
        this.snackBar.open('Movilidad Optativa editada', undefined, {
          duration: 2000,
          panelClass: 'accent-snackbar',
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
      }
      this.loading = false;
    }
  }

  async deleteOptionalMobility(): Promise<void> {
    await this.optionalMobilitiesService.delete(this.optionalMobility!._id!);
    this.router.navigate([PATHS.OPTIONAL_MOBILITIES.BASE_PATH]);
  }
}
