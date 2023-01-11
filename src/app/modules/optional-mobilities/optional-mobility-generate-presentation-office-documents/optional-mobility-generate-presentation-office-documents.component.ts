import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PATHS } from '@core/constants';
import { NameValueInterface } from '@core/interfaces';
import { Hospital, Specialty } from '@data/interfaces';
import {
  HospitalsService,
  OptionalMobilitiesService,
  SpecialtiesService,
} from '@data/services';

@Component({
  selector: 'app-optional-mobility-generate-presentation-office-documents',
  templateUrl:
    './optional-mobility-generate-presentation-office-documents.component.html',
  styleUrls: [
    './optional-mobility-generate-presentation-office-documents.component.css',
  ],
})
export class OptionalMobilityGeneratePresentationOfficeDocumentsComponent
  implements OnInit
{
  PATHS = PATHS.OPTIONAL_MOBILITIES;
  loading = false;
  hospitals: Hospital[] = [];
  specialties: Specialty[] = [];
  initialDates: NameValueInterface<Date>[] = [];
  finalDates: NameValueInterface<Date>[] = [];
  filtersFormControl = new FormGroup({
    initialDate: new FormControl<Date | null>(null, [Validators.required]),
    finalDate: new FormControl<Date | null>(null, [Validators.required]),
    hospital: new FormControl<string>('all', [Validators.required]),
    specialty: new FormControl<string>('all', [Validators.required]),
    initialNumberOfDocuments: new FormControl<number | undefined>(undefined, [
      Validators.required,
      Validators.min(0),
      Validators.pattern(/^\d+$/),
    ]),
    dateOfDocuments: new FormControl<Date | undefined>(undefined, [
      Validators.required,
    ]),
  });

  constructor(
    private optionalMobilitiesService: OptionalMobilitiesService,
    private hospitalsService: HospitalsService,
    private specialtiesService: SpecialtiesService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    //Sets the fist value of hospital and specialties to all
    this.hospitals = (
      [
        {
          _id: 'all',
          name: 'Todos',
          emails: [],
          phones: [],
          socialService: false,
        },
      ] as Hospital[]
    ).concat(await this.hospitalsService.getSocialServices());
    this.specialties = (
      [
        {
          duration: 3,
          value: 'Todas',
          _id: 'all',
        },
      ] as Specialty[]
    ).concat(await this.specialtiesService.findAll());
    const period = await this.optionalMobilitiesService.interval();
    this.initialDates = period.initialMonths;
    this.finalDates = period.finalMonths;
    if (period.finalMonths.length >= 3 && period.initialMonths.length >= 3) {
      this.filtersFormControl.controls.initialDate.setValue(
        period.initialMonths[period.initialMonths.length - 3].value
      );
      this.filtersFormControl.controls.finalDate.setValue(
        period.finalMonths[period.finalMonths.length - 1].value
      );
    }
    this.loading = false;
  }

  //If the initial period change and is greater than final period, final period will be equal to initial period
  initialDateChange() {
    if (
      this.filtersFormControl.controls.initialDate.value!.getTime() >
      this.filtersFormControl.controls.finalDate.value!.getTime()
    ) {
      const date = this.filtersFormControl.controls.initialDate.value!;
      const index = this.finalDates.findIndex((d) => {
        return (
          d.value.getTime() ==
          new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime()
        );
      });
      this.filtersFormControl.controls.finalDate.setValue(
        this.finalDates[index].value
      );
    }
  }

  //If the final period change and is below than initial period, initial period will be equal to final period
  finalDateChange() {
    if (
      this.filtersFormControl.controls.finalDate.value!.getTime() <
      this.filtersFormControl.controls.initialDate.value!.getTime()
    ) {
      const date = this.filtersFormControl.controls.finalDate.value!;
      const index = this.initialDates.findIndex((d) => {
        return (
          d.value.getTime() ==
          new Date(date.getFullYear(), date.getMonth(), 1).getTime()
        );
      });
      this.filtersFormControl.controls.initialDate.setValue(
        this.initialDates[index].value
      );
    }
  }

  //Send the information to the server to generate the documents
  async generate() {
    if (this.filtersFormControl.valid) {
      const values = this.filtersFormControl.value;
      //Receives a zip file as blob object
      const blob =
        await this.optionalMobilitiesService.generatePresentationOfficeDocuments(
          values.initialNumberOfDocuments!,
          values.dateOfDocuments!,
          values.initialDate!,
          values.finalDate!,
          values.hospital! == 'all' ? undefined : values.hospital!,
          values.specialty! == 'all' ? undefined : values.specialty!
        );

      if (blob) {
        //Creates an url and opens it
        var url = window.URL.createObjectURL(blob);
        var anchor = document.createElement('a');
        anchor.download = 'Oficios de Presentación.zip';
        anchor.href = url;
        anchor.click();
      }
    }
  }
}
