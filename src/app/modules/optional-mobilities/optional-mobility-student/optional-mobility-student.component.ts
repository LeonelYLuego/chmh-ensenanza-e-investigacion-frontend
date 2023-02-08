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
import { OptionalMobilityDocumentTypes } from '@data/types/optional-mobility-document.type';
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

/** Optional Mobility Student component */
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
  solicitudeDocument: SafeResourceUrl | null = null;
  presentationOfficeDocument: SafeResourceUrl | null = null;
  acceptanceDocument: SafeResourceUrl | null = null;
  evaluationDocument: SafeResourceUrl | null = null;

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
    //Validates if the param id is correct
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

  /**
   * Gets the Optional Mobility
   * @param _id
   */
  async getOptionalMobility(
    _id: string = this.optionalMobility!._id!
  ): Promise<void> {
    this.loading = true;
    this.optionalMobility = await this.optionalMobilitiesService.get(_id);
    if (this.optionalMobility) {
      //Gets all Hospitals
      this.hospitals = await this.hospitalsService.getAll();
      const student = await this.studentsService.get(
        this.optionalMobility.student as string
      );
      //Gets all Rotation Service based on the Student Specialty
      this.rotationServices = await this.rotationServicesService.getAll(
        (student!.specialty as Specialty)._id!
      );
      this.optionalMobilityFormControl.setValue({
        hospital: this.optionalMobility.hospital as string,
        initialDate: new Date(this.optionalMobility.initialDate),
        finalDate: new Date(this.optionalMobility.finalDate),
        rotationService: this.optionalMobility.rotationService as string,
      });
      this.solicitudeDocument =
        this.presentationOfficeDocument =
        this.acceptanceDocument =
        this.evaluationDocument =
          null;
      //If the document exists
      if (this.optionalMobility.solicitudeDocument) {
        //Gets the document and saves it in the variable
        this.solicitudeDocument =
          await this.optionalMobilitiesService.getDocument(
            this.optionalMobility!._id!,
            'solicitudeDocument'
          );
      }
      if (this.optionalMobility.presentationOfficeDocument) {
        this.presentationOfficeDocument =
          await this.optionalMobilitiesService.getDocument(
            this.optionalMobility!._id!,
            'presentationOfficeDocument'
          );
      }
      if (this.optionalMobility.acceptanceDocument) {
        this.acceptanceDocument =
          await this.optionalMobilitiesService.getDocument(
            this.optionalMobility!._id!,
            'acceptanceDocument'
          );
      }
      if (this.optionalMobility.evaluationDocument) {
        this.evaluationDocument =
          await this.optionalMobilitiesService.getDocument(
            this.optionalMobility!._id!,
            'evaluationDocument'
          );
      }
      this.loading = false;
    } else
      this.router.navigate([PATHS.ERROR.BASE_PATH, PATHS.ERROR.PAGE_NOT_FOUND]);
  }

  /**
   * Gets the month and year of the date picker and sets it to the initial date
   * @param normalizedMonthAndYear
   * @param datepicker
   */
  setInitialMonthAndYear(
    normalizedMonthAndYear: any,
    datepicker: MatDatepicker<Moment>
  ): void {
    this.optionalMobilityFormControl.controls.initialDate.setValue(
      normalizedMonthAndYear._d
    );
    datepicker.close();
  }

  /**
   * Gets the month and year of the date picker and sets it to the final date
   * @param normalizedMonthAndYear
   * @param datepicker
   */
  setFinalMonthAndYear(
    normalizedMonthAndYear: any,
    datepicker: MatDatepicker<Moment>
  ): void {
    this.optionalMobilityFormControl.controls.finalDate.setValue(
      normalizedMonthAndYear._d
    );
    datepicker.close();
  }

  /**
   * Sends the information to the server to update an Optional Mobility
   */
  async updateOptionalMobility(): Promise<void> {
    if (this.optionalMobilityFormControl.valid) {
      const values = this.optionalMobilityFormControl.value;
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
        this.optionalMobilityFormControl.controls.initialDate.setErrors({
          incorrect: true,
        });
        this.optionalMobilityFormControl.controls.finalDate.setErrors({
          incorrect: true,
        });
      } else {
        this.loading = true;
        const data = await this.optionalMobilitiesService.update(
          this.optionalMobility!._id!,
          {
            hospital: values.hospital!,
            initialDate,
            finalDate,
            rotationService: values.rotationService!,
            student: this.optionalMobility!.student,
          }
        );
        //If the Optional Mobility is updated shows a SnackBar to notify the user
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
  }

  /**
   * Deletes a Optional Mobility in the server
   */
  async deleteOptionalMobility(): Promise<void> {
    await this.optionalMobilitiesService.delete(this.optionalMobility!._id!);
    this.router.navigate([PATHS.OPTIONAL_MOBILITIES.BASE_PATH]);
  }

  /**
   * Updates the specified Optional Mobility document in the server
   * @param event
   * @param type
   */
  async updateFile(
    event: any,
    type: OptionalMobilityDocumentTypes
  ): Promise<void> {
    this.loading = true;
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      await this.optionalMobilitiesService.updateDocument(
        this.optionalMobility!._id!,
        type,
        formData
      );
      await this.getOptionalMobility();
    }
  }

  /**
   * Deletes the specified Optional Mobility document in the server
   * @param type
   */
  async deleteFile(type: OptionalMobilityDocumentTypes): Promise<void> {
    this.loading = true;
    await this.optionalMobilitiesService.deleteDocument(
      this.optionalMobility!._id!,
      type
    );
    await this.getOptionalMobility();
  }

  /**
   * Cancels an Optional Mobility
   */
  async cancel(): Promise<void> {
    await this.optionalMobilitiesService.cancel(this.optionalMobility!._id!);
    await this.getOptionalMobility();
  }

  /**
   * Uncancels an Optional Mobility
   */
  async uncancel(): Promise<void> {
    await this.optionalMobilitiesService.uncancel(this.optionalMobility!._id!);
    await this.getOptionalMobility();
  }
}
