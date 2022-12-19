import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PATHS } from '@core/constants';
import {
  Hospital,
  ObligatoryMobility,
  ObligatoryMobilityInterval,
  RotationService,
  Specialty,
  Student,
} from '@data/interfaces';
import { ObligatoryMobilitiesService } from '@data/services';

@Component({
  selector: 'app-obligatory-mobilities-page',
  templateUrl: './obligatory-mobilities-page.component.html',
  styleUrls: ['./obligatory-mobilities-page.component.css'],
})
export class ObligatoryMobilitiesPageComponent implements OnInit {
  loading = false;
  paths = PATHS.OBLIGATORY_MOBILITIES;
  intervals: ObligatoryMobilityInterval = {
    finalMonths: [],
    initialMonths: [],
  };
  intervalFormControl = new FormGroup({
    initialDate: new FormControl<Date | undefined>(undefined, [
      Validators.required,
    ]),
    finalDate: new FormControl<Date | undefined>(undefined, [
      Validators.required,
    ]),
  });
  obligatoryMobilities: {
    specialty?: Specialty;
    _id?: string;
    student?: Student;
    hospital?: Hospital;
    rotationService?: RotationService;
    period?: string;
    documents?: {
      presentationOfficeDocument?: string;
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
    private obligatoryMobilitiesService: ObligatoryMobilitiesService
  ) {}

  async ngOnInit(): Promise<void> {
    this.intervals = await this.obligatoryMobilitiesService.interval();
    if (
      this.intervals.finalMonths.length > 0 &&
      this.intervals.initialMonths.length > 0
    ) {
      this.intervalFormControl.controls.initialDate.setValue(
        this.intervals.initialMonths[this.intervals.initialMonths.length - 12]
          .value
      );
      this.intervalFormControl.controls.finalDate.setValue(
        this.intervals.finalMonths[this.intervals.finalMonths.length - 1].value
      );
    }
    await this.getObligatoryMobilities();
  }

  async getObligatoryMobilities(): Promise<void> {
    this.loading = true;
    this.obligatoryMobilities = [];
    const data = await this.obligatoryMobilitiesService.getAll(
      this.intervalFormControl.controls.initialDate.value!,
      this.intervalFormControl.controls.finalDate.value!
    );
    data.sort((a, b) => a.value.localeCompare(b.value));
    data.map((specialty) => {
      this.obligatoryMobilities.push({
        specialty: {
          _id: specialty._id,
          value: specialty.value,
          duration: NaN,
          headOfService: '',
          tenuredPostgraduateProfessor: '',
        },
      });
      ((specialty as any).optionalMobilities as ObligatoryMobility[]).sort(
        (a, b) =>
          (a.student as Student).firstLastName.localeCompare(
            (b.student as Student).firstLastName
          )
      );
      ((specialty as any).optionalMobilities as ObligatoryMobility[]).map(
        (obligatoryMobility) => {
          this.obligatoryMobilities.push({
            _id: obligatoryMobility._id,
            hospital: obligatoryMobility.hospital as Hospital,
            student: obligatoryMobility.student as Student,
            rotationService:
              obligatoryMobility.rotationService as RotationService,
            period: this.obligatoryMobilitiesService.getPeriod(
              new Date(obligatoryMobility.initialDate),
              new Date(obligatoryMobility.finalDate)
            ),
            documents: {
              evaluationDocument: obligatoryMobility.evaluationDocument,
              presentationOfficeDocument:
                obligatoryMobility.presentationOfficeDocument,
            },
          });
        }
      );
    });
    this.loading = false;
  }

  initialDateChanged(): void {
    if (
      this.intervalFormControl.controls.initialDate.value!.getTime() >
      this.intervalFormControl.controls.finalDate.value!.getTime()
    ) {
      const date = this.intervalFormControl.controls.initialDate.value!;
      const index = this.intervals.finalMonths.findIndex((d) => {
        return (
          d.value.getTime() ==
          new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime()
        );
      });
      this.intervalFormControl.controls.finalDate.setValue(
        this.intervals.finalMonths[index].value
      );
    }
    this.getObligatoryMobilities();
  }

  finalDateChanged(): void {
    if (
      this.intervalFormControl.controls.finalDate.value!.getTime() <
      this.intervalFormControl.controls.initialDate.value!.getTime()
    ) {
      const date = this.intervalFormControl.controls.finalDate.value!;
      const index = this.intervals.initialMonths.findIndex((d) => {
        return (
          d.value.getTime() ==
          new Date(date.getFullYear(), date.getMonth(), 1).getTime()
        );
      });
      this.intervalFormControl.controls.initialDate.setValue(
        this.intervals.initialMonths[index].value
      );
    }
    this.getObligatoryMobilities();
  }
}
