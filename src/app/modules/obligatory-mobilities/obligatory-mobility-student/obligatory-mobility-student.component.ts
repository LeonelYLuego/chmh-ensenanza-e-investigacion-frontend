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
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { PATHS } from '@core/constants';
import {
  Hospital,
  ObligatoryMobilityResponse,
  RotationService,
  Specialty,
  Student,
} from '@data/interfaces';
import {
  HospitalsService,
  ObligatoryMobilitiesService,
  RotationServicesService,
  StudentsService,
} from '@data/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ObligatoryMobilityDocumentTypes,
  ObligatoryMobilityDocumentTypesArray,
} from '@data/types/obligatory-mobility-document.type';
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

/** Obligatory Mobility Student component */
@Component({
  selector: 'app-obligatory-mobility-student',
  templateUrl: './obligatory-mobility-student.component.html',
  styleUrls: ['./obligatory-mobility-student.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ObligatoryMobilityStudentComponent implements OnInit {
  loading = false;
  obligatoryMobility?: ObligatoryMobilityResponse;
  hospitals: Hospital[] = [];
  rotationServices: RotationService[] = [];
  obligatoryMobilityFormControl = new FormGroup({
    hospital: new FormControl<string>('', [Validators.required]),
    initialDate: new FormControl<Date>(new Date(), [Validators.required]),
    finalDate: new FormControl<Date>(new Date(), [Validators.required]),
    rotationService: new FormControl<string>('', [Validators.required]),
  });
  documents: {
    title: string;
    name: ObligatoryMobilityDocumentTypes;
    url: SafeResourceUrl | null;
  }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private obligatoryMobilitiesService: ObligatoryMobilitiesService,
    private hospitalsService: HospitalsService,
    private rotationServicesService: RotationServicesService,
    private studentsService: StudentsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      const _id = params['_id'];
      if (/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(_id)) {
        await this.getObligatoryMobility(_id);
      } else {
        this.router.navigate([
          PATHS.ERROR.BASE_PATH,
          PATHS.ERROR.PAGE_NOT_FOUND,
        ]);
      }
    });
  }

  /** Gets the Obligatory Mobility by _id */
  async getObligatoryMobility(_id: string): Promise<void> {
    this.loading = true;
    this.obligatoryMobility =
      (await this.obligatoryMobilitiesService.get(_id)) ?? undefined;
    // If the Obligatory Mobility exist
    if (this.obligatoryMobility) {
      this.hospitals = await this.hospitalsService.getAll();
      const student = await this.studentsService.get(
        (this.obligatoryMobility.student as Student)._id!
      );
      this.rotationServices = await this.rotationServicesService.getAll(
        (student!.specialty as Specialty)._id!
      );
      // Sets the values for the Obligatory Mobility
      this.obligatoryMobilityFormControl.setValue({
        finalDate: new Date(this.obligatoryMobility.finalDate),
        initialDate: new Date(this.obligatoryMobility.initialDate),
        hospital: this.obligatoryMobility.hospital as string,
        rotationService: this.obligatoryMobility.rotationService as string,
      });
      // Gets the documents
      this.documents = [];
      for (let document of ObligatoryMobilityDocumentTypesArray) {
        // For solitude and acceptance documents don't show the options
        if (
          document.type == 'solicitudeDocument' ||
          document.type == 'acceptanceDocument'
        ) {
          await Promise.all(
            this.obligatoryMobility[document.type].map(
              async (attachmentDocument) => {
                this.documents.push({
                  title: document.title,
                  name: document.type,
                  url: await this.obligatoryMobilitiesService.getAttachmentsDocument(
                    attachmentDocument,
                    document.type as 'solicitudeDocument' | 'acceptanceDocument'
                  ),
                });
              }
            )
          );
        } else {
          this.documents.push({
            title: document.title,
            name: document.type,
            url: this.obligatoryMobility[document.type]
              ? await this.obligatoryMobilitiesService.getDocument(
                  this.obligatoryMobility._id!,
                  document.type
                )
              : null,
          });
        }
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
    this.obligatoryMobilityFormControl.controls.initialDate.setValue(
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
    this.obligatoryMobilityFormControl.controls.finalDate.setValue(
      normalizedMonthAndYear._d
    );
    datepicker.close();
  }

  /**
   * Updates a Obligatory Mobility
   */
  async updateObligatoryMobility(): Promise<void> {
    // Checks if the form control is valid
    if (this.obligatoryMobilityFormControl.valid) {
      const values = this.obligatoryMobilityFormControl.value;
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
      // Checks if the dates are valid
      if (initialDate.getTime() > finalDate.getTime()) {
        this.obligatoryMobilityFormControl.controls.initialDate.setErrors({
          incorrect: true,
        });
        this.obligatoryMobilityFormControl.controls.finalDate.setErrors({
          incorrect: true,
        });
      } else {
        this.loading = true;
        const data = await this.obligatoryMobilitiesService.update(
          this.obligatoryMobility!._id!,
          {
            hospital: values.hospital!,
            initialDate,
            finalDate,
            rotationService: values.rotationService!,
            student: (this.obligatoryMobility!.student as Student)._id!,
          }
        );
        if (data) {
          await this.getObligatoryMobility(this.obligatoryMobility!._id!);
          // Shows a snackbar if the Obligatory Mobility has been modified
          this.snackBar.open('Movilidad Obligatoria editada', undefined, {
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
   * Deletes a Obligatory Mobility
   */
  async deleteObligatoryMobility(): Promise<void> {
    await this.obligatoryMobilitiesService.delete(
      this.obligatoryMobility!._id!
    );
    this.router.navigate([PATHS.OBLIGATORY_MOBILITIES.BASE_PATH]);
  }

  /**
   * Cancels a Obligatory Mobility
   */
  async cancel(): Promise<void> {
    await this.obligatoryMobilitiesService.cancel(
      this.obligatoryMobility!._id!
    );
    await this.getObligatoryMobility(this.obligatoryMobility!._id!);
  }

  /**
   * Uncancels a Obligatory Mobility
   */
  async uncancel(): Promise<void> {
    await this.obligatoryMobilitiesService.uncancel(
      this.obligatoryMobility!._id!
    );
    await this.getObligatoryMobility(this.obligatoryMobility!._id!);
  }

  /**
   * Updates the specified document
   * @param event
   * @param type
   */
  async updateFile(
    event: any,
    type: ObligatoryMobilityDocumentTypes
  ): Promise<void> {
    this.loading = true;
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      await this.obligatoryMobilitiesService.updateDocument(
        this.obligatoryMobility!._id!,
        type,
        formData
      );
      await this.getObligatoryMobility(this.obligatoryMobility!._id!);
    }
  }

  /**
   * Deletes the specified file
   * @param type
   */
  async deleteFile(type: ObligatoryMobilityDocumentTypes): Promise<void> {
    this.loading = true;
    await this.obligatoryMobilitiesService.deleteDocument(
      this.obligatoryMobility!._id!,
      type
    );
    await this.getObligatoryMobility(this.obligatoryMobility!._id!);
  }
}
