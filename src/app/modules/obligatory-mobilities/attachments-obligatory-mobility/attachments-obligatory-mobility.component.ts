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
import {
  AttachmentsObligatoryMobilityDocumentTypes,
  AttachmentsObligatoryMobilityDocumentTypesArray,
} from '@data/types';
import { SafeResourceUrl } from '@angular/platform-browser';

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

/** Attachments Obligatory Mobility component */
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
  showGenerate = false;
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
  documents: {
    title: string;
    name: AttachmentsObligatoryMobilityDocumentTypes;
    url: SafeResourceUrl | null;
  }[] = [];

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

  /**
   * Gets a Attachment Obligatory Mobility based on the provided _id
   * @param _id
   */
  async getAttachmentsObligatoryMobility(_id: string): Promise<void> {
    this.loading = true;
    this.attachmentsObligatoryMobilityResponse =
      (await this.obligatoryMobilitiesService.getAttachments(_id)) ?? undefined;
    // If the Attachments Obligatory Mobility exist
    if (this.attachmentsObligatoryMobilityResponse) {
      // Sets the values to initial and final date
      this.attachmentsObligatoryMobilityFormControl.setValue({
        initialDate: new Date(
          this.attachmentsObligatoryMobilityResponse.initialDate
        ),
        finalDate: new Date(
          this.attachmentsObligatoryMobilityResponse.finalDate
        ),
      });
      // Gets the documents
      this.documents = [];
      for (let document of AttachmentsObligatoryMobilityDocumentTypesArray) {
        this.documents.push({
          title: document.title,
          name: document.type,
          url: this.attachmentsObligatoryMobilityResponse[document.type]
            ? await this.obligatoryMobilitiesService.getAttachmentsDocument(
                this.attachmentsObligatoryMobilityResponse._id!,
                document.type
              )
            : null,
        });
      }
      this.loading = false;
    } else
      this.router.navigate([PATHS.ERROR.BASE_PATH, PATHS.ERROR.PAGE_NOT_FOUND]);
  }

  /**
   * Sets initial month and year of a datepicker
   * @param normalizedMonthAndYear
   * @param datepicker
   */
  setInitialMonthAndYear(
    normalizedMonthAndYear: any,
    datepicker: MatDatepicker<Moment>
  ): void {
    this.attachmentsObligatoryMobilityFormControl.controls.initialDate.setValue(
      normalizedMonthAndYear._d
    );
    datepicker.close();
  }

  /**
   * Sets final month and year of a datepicker
   * @param normalizedMonthAndYear
   * @param datepicker
   */
  setFinalMonthAndYear(
    normalizedMonthAndYear: any,
    datepicker: MatDatepicker<Moment>
  ): void {
    this.attachmentsObligatoryMobilityFormControl.controls.finalDate.setValue(
      normalizedMonthAndYear._d
    );
    datepicker.close();
  }

  /**
   * Converts a initial date type to string
   * @param date
   * @returns
   */
  initialDateToString(date: Date): string {
    return getFirstDayOfMonthAsString(new Date(date));
  }

  /**
   * Converts a final date type to string
   * @param date
   * @returns
   */
  finalDateToString(date: Date): string {
    return getLastDayOfMonthAsString(new Date(date));
  }

  /**
   * Sends the data to update a Attachments Obligatory Mobility
   */
  async updateAttachmentsObligatoryMobility(): Promise<void> {
    // Checks that the form control is valid
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
      // Checks that dates are valid
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
          // Opens a snackbar to indicate that Attachments Obligatory Mobility
          // has been modified
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

  /**
   * Deletes the Attachments Obligatory Mobility
   */
  async deleteAttachmentsObligatoryMobility(): Promise<void> {
    await this.obligatoryMobilitiesService.deleteAttachments(
      this.attachmentsObligatoryMobilityResponse!._id
    );
    this.router.navigate([
      PATHS.OBLIGATORY_MOBILITIES.BASE_PATH,
      PATHS.OBLIGATORY_MOBILITIES.ATTACHMENTS,
    ]);
  }

  /**
   * Updates the specified file
   * @param event
   * @param type
   */
  async updateFile(
    event: any,
    type: AttachmentsObligatoryMobilityDocumentTypes
  ): Promise<void> {
    this.loading = true;
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      await this.obligatoryMobilitiesService.updateAttachmentsDocument(
        this.attachmentsObligatoryMobilityResponse!._id!,
        type,
        formData
      );
      await this.getAttachmentsObligatoryMobility(
        this.attachmentsObligatoryMobilityResponse!._id!
      );
    }
  }

  /**
   * Deletes the specified file
   * @param type
   */
  async deleteFile(
    type: AttachmentsObligatoryMobilityDocumentTypes
  ): Promise<void> {
    this.loading = true;
    await this.obligatoryMobilitiesService.deleteAttachmentsDocument(
      this.attachmentsObligatoryMobilityResponse!._id!,
      type
    );
    await this.getAttachmentsObligatoryMobility(
      this.attachmentsObligatoryMobilityResponse!._id!
    );
  }
}
