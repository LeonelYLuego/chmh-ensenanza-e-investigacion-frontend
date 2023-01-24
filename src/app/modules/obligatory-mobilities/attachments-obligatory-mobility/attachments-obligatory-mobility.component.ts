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
import { ActivatedRoute, Router } from '@angular/router';
import { PATHS } from '@core/constants';
import { AttachmentsObligatoryMobilityResponse } from '@data/interfaces';
import { ObligatoryMobilitiesService } from '@data/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  getFirstDayOfMonthAsString,
  getLastDayOfMonthAsString,
} from '@core/functions/date.function';

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
  selector: 'app-attachments-obligatory-mobility',
  templateUrl: './attachments-obligatory-mobility.component.html',
  styleUrls: ['./attachments-obligatory-mobility.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AttachmentsObligatoryMobilityComponent implements OnInit {
  loading = false;
  attachmentsObligatoryMobilityResponse?: AttachmentsObligatoryMobilityResponse;
  attachmentsObligatoryMobilityFormControl = new FormGroup({
    initialDate: new FormControl<Date | null>(null, [Validators.required]),
    finalDate: new FormControl<Date | null>(null, [Validators.required]),
  });
  displayedColumns = [
    'student',
    'initialDate',
    'finalDate',
    'rotationService',
    'documents',
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private obligatoryMobilitiesService: ObligatoryMobilitiesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      const _id = params['_id'];
      if (/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(_id)) {
        await this.getAttachmentsObligatoryMobility(_id);
      } else {
        this.router.navigate([
          PATHS.ERROR.BASE_PATH,
          PATHS.ERROR.PAGE_NOT_FOUND,
        ]);
      }
    });
  }

  async getAttachmentsObligatoryMobility(_id: string): Promise<void> {
    this.loading = true;
    this.attachmentsObligatoryMobilityResponse =
      (await this.obligatoryMobilitiesService.getAttachments(_id)) ?? undefined;
    if (this.attachmentsObligatoryMobilityResponse) {
      this.attachmentsObligatoryMobilityFormControl.setValue({
        initialDate: new Date(
          this.attachmentsObligatoryMobilityResponse.initialDate
        ),
        finalDate: new Date(
          this.attachmentsObligatoryMobilityResponse.finalDate
        ),
      });
      this.loading = false;
    } else
      this.router.navigate([PATHS.ERROR.BASE_PATH, PATHS.ERROR.PAGE_NOT_FOUND]);
  }

  setInitialMonthAndYear(
    normalizedMonthAndYear: any,
    datepicker: MatDatepicker<Moment>
  ): void {
    this.attachmentsObligatoryMobilityFormControl.controls.initialDate.setValue(
      normalizedMonthAndYear._d
    );
    datepicker.close();
  }

  setFinalMonthAndYear(
    normalizedMonthAndYear: any,
    datepicker: MatDatepicker<Moment>
  ): void {
    this.attachmentsObligatoryMobilityFormControl.controls.finalDate.setValue(
      normalizedMonthAndYear._d
    );
    datepicker.close();
  }

  initialDateToString(date: Date): string {
    return getFirstDayOfMonthAsString(new Date(date));
  }

  finalDateToString(date: Date): string {
    return getLastDayOfMonthAsString(new Date(date));
  }

  async updateAttachmentsObligatoryMobility(): Promise<void> {
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
        const data = await this.obligatoryMobilitiesService.updateAttachments(
          this.attachmentsObligatoryMobilityResponse!._id!,
          {
            finalDate,
            initialDate,
            hospital: this.attachmentsObligatoryMobilityResponse!.hospital,
            specialty: this.attachmentsObligatoryMobilityResponse!.specialty,
          }
        );
        if (data) {
          this.attachmentsObligatoryMobilityResponse =
            (await this.obligatoryMobilitiesService.getAttachments(
              this.attachmentsObligatoryMobilityResponse!._id!
            )) ?? undefined;
          this.snackBar.open('Solicitud y Aceptación editada', undefined, {
            duration: 2000,
            panelClass: 'accent-snackbar',
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
          });
        }
        this.loading = false;
      }
    }
  }

  async deleteAttachmentsObligatoryMobility(): Promise<void> {
    await this.obligatoryMobilitiesService.deleteAttachments(
      this.attachmentsObligatoryMobilityResponse!._id
    );
    this.router.navigate([
      PATHS.OBLIGATORY_MOBILITIES.BASE_PATH,
      PATHS.OBLIGATORY_MOBILITIES.ATTACHMENTS,
    ]);
  }
}
