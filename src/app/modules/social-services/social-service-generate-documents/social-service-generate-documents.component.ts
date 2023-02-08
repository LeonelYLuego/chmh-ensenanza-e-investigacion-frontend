import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NameValueInterface } from '@core/interfaces';
import { Hospital, Specialty } from '@data/interfaces';
import {
  HospitalsService,
  SocialServicesService,
  SpecialtiesService,
} from '@data/services';

/** Social Service generate document component */
@Component({
  selector: 'app-social-service-generate-documents',
  templateUrl: './social-service-generate-documents.component.html',
  styleUrls: ['./social-service-generate-documents.component.css'],
})
export class SocialServiceGenerateDocumentsComponent implements OnInit {
  loading = false;
  hospitals: Hospital[] = [];
  specialties: Specialty[] = [];
  initialPeriods: NameValueInterface<{ year: number; period: number }>[] = [];
  finalPeriods: NameValueInterface<{ year: number; period: number }>[] = [];
  filtersFormControl = new FormGroup({
    initialPeriod: new FormControl<{ year: number; period: number } | null>(
      null,
      [Validators.required]
    ),
    finalPeriod: new FormControl<{ year: number; period: number } | null>(
      null,
      [Validators.required]
    ),
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
    private socialServicesService: SocialServicesService,
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
    const periods = await this.socialServicesService.getInitialFinalPeriods();
    this.initialPeriods = periods.map((p) => p.initial);
    this.finalPeriods = periods.map((p) => p.final);
    if (periods.length >= 3) {
      this.filtersFormControl.controls.initialPeriod.setValue(
        periods[periods.length - 3].initial.value
      );
      this.filtersFormControl.controls.finalPeriod.setValue(
        periods[periods.length - 1].final.value
      );
    }
    this.loading = false;
  }

  /** Validates a period */
  private validatePeriod(): boolean {
    const value = this.filtersFormControl.value;
    const initial = value.initialPeriod!;
    const final = value.finalPeriod!;
    return (
      final.year < initial.year ||
      (final.year == initial.year && final.period < initial.period)
    );
  }

  /** If the initial period change and is greater than final period, final period will be equal to initial period */
  initialPeriodChange() {
    if (this.validatePeriod()) {
      const value = this.filtersFormControl.value.initialPeriod!;
      const index = this.finalPeriods.findIndex((period) => {
        return (
          value.period == period.value.period && value.year == period.value.year
        );
      });
      this.filtersFormControl.controls.finalPeriod.setValue(
        this.finalPeriods[index].value
      );
    }
  }

  /** If the final period change and is below than initial period, initial period will be equal to final period */
  finalPeriodChange() {
    if (this.validatePeriod()) {
      const value = this.filtersFormControl.value.finalPeriod!;
      const index = this.initialPeriods.findIndex((period) => {
        return (
          value.period == period.value.period && value.year == period.value.year
        );
      });
      this.filtersFormControl.controls.initialPeriod.setValue(
        this.initialPeriods[index].value
      );
    }
  }

  /** Send the information to the server to generate the documents */
  async generate() {
    if (this.filtersFormControl.valid) {
      const values = this.filtersFormControl.value;
      //Receives a zip file as blob object
      const blob = await this.socialServicesService.generateDocuments(
        values.initialNumberOfDocuments!,
        values.dateOfDocuments!,
        values.initialPeriod!.period,
        values.initialPeriod!.year,
        values.finalPeriod!.period,
        values.finalPeriod!.year,
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
