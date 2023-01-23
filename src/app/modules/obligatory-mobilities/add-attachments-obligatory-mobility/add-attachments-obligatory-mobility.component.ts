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
import { Moment } from 'moment';
import { Hospital, ObligatoryMobility, Specialty } from '@data/interfaces';
import {
  HospitalsService,
  ObligatoryMobilitiesService,
  SpecialtiesService,
} from '@data/services';
import {
  getFirstDayOfMonthAsString,
  getLastDayOfMonthAsString,
} from '@core/functions/date.function';
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
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-attachments-obligatory-mobility',
  templateUrl: './add-attachments-obligatory-mobility.component.html',
  styleUrls: ['./add-attachments-obligatory-mobility.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddAttachmentsObligatoryMobilityComponent implements OnInit {
  loading = false;
  attachmentsObligatoryMobilityFormControl = new FormGroup({
    specialty: new FormControl('', [Validators.required]),
    hospital: new FormControl('', [Validators.required]),
    initialDate: new FormControl<Date | null>(null, [Validators.required]),
    finalDate: new FormControl<Date | null>(null, [Validators.required]),
  });
  obligatoryMobilities: ObligatoryMobility[] = [];
  specialties: Specialty[] = [];
  hospitals: Hospital[] = [];
  displayedColumns = [
    'student',
    'initialDate',
    'finalDate',
    'rotationService',
    'documents',
  ];

  constructor(
    private obligatoryMobilitiesService: ObligatoryMobilitiesService,
    private specialtiesService: SpecialtiesService,
    private hospitalsService: HospitalsService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.specialties = await this.specialtiesService.findAll();
    this.hospitals = await this.hospitalsService.getAll();
  }

  async setInitialMonthAndYear(
    normalizedMonthAndYear: any,
    datepicker: MatDatepicker<Moment>
  ): Promise<void> {
    this.attachmentsObligatoryMobilityFormControl.controls.initialDate.setValue(
      normalizedMonthAndYear._d
    );
    datepicker.close();
    await this.getObligatoryMobilities();
  }

  async setFinalMonthAndYear(
    normalizedMonthAndYear: any,
    datepicker: MatDatepicker<Moment>
  ): Promise<void> {
    this.attachmentsObligatoryMobilityFormControl.controls.finalDate.setValue(
      normalizedMonthAndYear._d
    );
    datepicker.close();
    await this.getObligatoryMobilities();
  }

  initialDateToString(date: Date): string {
    return getFirstDayOfMonthAsString(new Date(date));
  }

  finalDateToString(date: Date): string {
    return getLastDayOfMonthAsString(new Date(date));
  }

  async getObligatoryMobilities(): Promise<void> {
    if (this.attachmentsObligatoryMobilityFormControl.valid) {
      const values = this.attachmentsObligatoryMobilityFormControl.value;
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
      if (initialDate.getTime() > finalDate.getTime()) {
        this.attachmentsObligatoryMobilityFormControl.controls.initialDate.setErrors(
          {
            incorrect: true,
          }
        );
        this.attachmentsObligatoryMobilityFormControl.controls.finalDate.setErrors(
          {
            incorrect: true,
          }
        );
      } else {
        this.loading = true;
        this.obligatoryMobilities =
          await this.obligatoryMobilitiesService.getAll(
            values.specialty!,
            values.hospital!,
            initialDate,
            finalDate
          );
        this.loading = false;
      }
    }
  }

  async addAttachmentsObligatoryMobility(): Promise<void> {
    if (this.attachmentsObligatoryMobilityFormControl.valid) {
      const values = this.attachmentsObligatoryMobilityFormControl.value;
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
      if (initialDate.getTime() > finalDate.getTime()) {
        this.attachmentsObligatoryMobilityFormControl.controls.initialDate.setErrors(
          {
            incorrect: true,
          }
        );
        this.attachmentsObligatoryMobilityFormControl.controls.finalDate.setErrors(
          {
            incorrect: true,
          }
        );
      } else {
        this.loading = true;
        const data = await this.obligatoryMobilitiesService.addAttachments({
          specialty: values.specialty!,
          hospital: values.hospital!,
          initialDate,
          finalDate,
        });
        if (data)
          this.router.navigate([
            PATHS.OBLIGATORY_MOBILITIES.BASE_PATH,
            PATHS.OBLIGATORY_MOBILITIES.ATTACHMENTS,
          ]);
        this.loading = false;
      }
    }
  }
}
