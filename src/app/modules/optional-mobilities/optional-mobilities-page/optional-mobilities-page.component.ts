import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PATHS } from '@core/constants';
import {
  Hospital,
  OptionalMobility,
  RotationService,
  Specialty,
  Student,
} from '@data/interfaces';
import { OptionalMobilitiesService } from '@data/services';

/** Optional Mobilities page component */
@Component({
  selector: 'app-optional-mobilities-page',
  templateUrl: './optional-mobilities-page.component.html',
  styleUrls: ['./optional-mobilities-page.component.css'],
})
export class OptionalMobilitiesPageComponent implements OnInit {
  loading = false;
  paths = PATHS.OPTIONAL_MOBILITIES;
  interval: {
    initialMonths: { name: string; value: Date }[];
    finalMonths: { name: string; value: Date }[];
  } = { initialMonths: [], finalMonths: [] };
  intervalFormControl = new FormGroup({
    initialDate: new FormControl<Date | undefined>(undefined, [
      Validators.required,
    ]),
    finalDate: new FormControl<Date | undefined>(undefined, [
      Validators.required,
    ]),
  });
  optionalMobilities: {
    specialty?: Specialty;
    _id?: string;
    student?: Student;
    hospital?: Hospital;
    rotationService?: RotationService;
    period?: string;
    canceled?: boolean;
    documents?: {
      solicitudeDocument?: string;
      presentationOfficeDocument?: string;
      acceptanceDocument?: string;
      evaluationDocument?: string;
    };
  }[] = [];
  displayedColumns = [
    'student',
    'hospital',
    'rotationService',
    'period',
    'documents',
  ];

  constructor(
    private optionalMobilitiesService: OptionalMobilitiesService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    //Gets the interval to find the Optional Mobilities
    this.interval = await this.optionalMobilitiesService.interval();
    if (
      this.interval.initialMonths.length > 0 &&
      this.interval.finalMonths.length > 0
    ) {
      this.intervalFormControl.controls.initialDate.setValue(
        this.interval.initialMonths[this.interval.initialMonths.length - 12]
          .value
      );
      this.intervalFormControl.controls.finalDate.setValue(
        this.interval.finalMonths[this.interval.finalMonths.length - 1].value
      );
      this.getOptionalMobilities();
    }
  }

  /** If the initial date change and it is greater than the final date, sets the final date equal to the initial date */
  initialDateChanged(): void {
    if (
      this.intervalFormControl.controls.initialDate.value!.getTime() >
      this.intervalFormControl.controls.finalDate.value!.getTime()
    ) {
      const date = this.intervalFormControl.controls.initialDate.value!;
      const index = this.interval.finalMonths.findIndex((d) => {
        return (
          d.value.getTime() ==
          new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime()
        );
      });
      this.intervalFormControl.controls.finalDate.setValue(
        this.interval.finalMonths[index].value
      );
    }
    this.getOptionalMobilities();
  }

  /** If the final date change and it is less than the initial date, sets the initial date equal to the final date */
  finalDateChanged(): void {
    if (
      this.intervalFormControl.controls.finalDate.value!.getTime() <
      this.intervalFormControl.controls.initialDate.value!.getTime()
    ) {
      const date = this.intervalFormControl.controls.finalDate.value!;
      const index = this.interval.initialMonths.findIndex((d) => {
        return (
          d.value.getTime() ==
          new Date(date.getFullYear(), date.getMonth(), 1).getTime()
        );
      });
      this.intervalFormControl.controls.initialDate.setValue(
        this.interval.initialMonths[index].value
      );
    }
    this.getOptionalMobilities();
  }

  /** Gets Optional Mobilities */
  async getOptionalMobilities(): Promise<void> {
    this.loading = true;
    this.optionalMobilities = [];
    const data = await this.optionalMobilitiesService.getAll(
      this.intervalFormControl.controls.initialDate.value!,
      this.intervalFormControl.controls.finalDate.value!
    );
    //Sorts the Optional Mobilities by Specialty
    data.sort((a, b) => a.value.localeCompare(b.value));
    data.map((specialty) => {
      this.optionalMobilities.push({
        specialty: {
          _id: specialty._id,
          value: specialty.value,
          duration: NaN,
          headOfService: '',
          tenuredPostgraduateProfessor: '',
        },
      });
      //Sorts the Optional Mobilities by Student
      ((specialty as any).optionalMobilities as OptionalMobility[]).sort(
        (a, b) =>
          (a.student as Student).firstLastName.localeCompare(
            (b.student as Student).firstLastName
          )
      );
      ((specialty as any).optionalMobilities as OptionalMobility[]).map(
        (optionalMobility) => {
          //Add the Optional Mobility to the array of Optional Mobilities
          this.optionalMobilities.push({
            _id: optionalMobility._id,
            hospital: optionalMobility.hospital as Hospital,
            student: optionalMobility.student as Student,
            rotationService:
              optionalMobility.rotationService as RotationService,
            period: this.optionalMobilitiesService.getPeriod(
              new Date(optionalMobility.initialDate),
              new Date(optionalMobility.finalDate)
            ),
            canceled: optionalMobility.canceled,
            documents: {
              acceptanceDocument: optionalMobility.acceptanceDocument,
              evaluationDocument: optionalMobility.evaluationDocument,
              presentationOfficeDocument:
                optionalMobility.presentationOfficeDocument,
              solicitudeDocument: optionalMobility.solicitudeDocument,
            },
          });
        }
      );
    });
    this.loading = false;
  }

  /** Opens the Optional Mobility Student page */
  async updateOptionalMobility(row: OptionalMobility) {
    this.router.navigate([this.paths.BASE_PATH, row._id!]);
  }
}
