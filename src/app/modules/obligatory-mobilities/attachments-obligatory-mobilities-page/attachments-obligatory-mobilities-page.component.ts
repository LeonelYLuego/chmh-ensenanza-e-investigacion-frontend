import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PATHS } from '@core/constants';
import {
  getFirstDayOfMonthAsString,
  getLastDayOfMonthAsString,
} from '@core/functions/date.function';
import {
  AttachmentsObligatoryMobilityByHospital,
  ObligatoryMobilityInterval,
  Specialty,
} from '@data/interfaces';
import {
  ObligatoryMobilitiesService,
  SpecialtiesService,
} from '@data/services';

/**
 * Attachments Obligatory Mobility page component
 */
@Component({
  selector: 'app-attachments-obligatory-mobilities-page',
  templateUrl: './attachments-obligatory-mobilities-page.component.html',
  styleUrls: ['./attachments-obligatory-mobilities-page.component.css'],
})
export class AttachmentsObligatoryMobilitiesPageComponent implements OnInit {
  paths = PATHS.OBLIGATORY_MOBILITIES;
  loading = false;
  filtersFormControl = new FormGroup({
    specialty: new FormControl('', [Validators.required]),
    initialDate: new FormControl<Date | null>(null, [Validators.required]),
    finalDate: new FormControl<Date | null>(null, [Validators.required]),
  });
  specialties: Specialty[] = [];
  intervals: ObligatoryMobilityInterval = {
    finalMonths: [],
    initialMonths: [],
  };
  attachmentsObligatoryMobilitiesByHospital: AttachmentsObligatoryMobilityByHospital[] =
    [];

  constructor(
    private obligatoryMobilitiesService: ObligatoryMobilitiesService,
    private specialtiesService: SpecialtiesService
  ) {}

  async ngOnInit(): Promise<void> {
    this.specialties = await this.specialtiesService.findAll();
    this.intervals = await this.obligatoryMobilitiesService.interval();
    if (
      this.intervals.initialMonths.length > 3 &&
      this.intervals.finalMonths.length > 3
    ) {
      this.filtersFormControl.controls.initialDate.setValue(
        this.intervals.initialMonths[this.intervals.initialMonths.length - 12]
          .value
      );
      this.filtersFormControl.controls.finalDate.setValue(
        this.intervals.finalMonths[this.intervals.finalMonths.length - 1].value
      );
    }
  }

  /**
   * Gets Attachments Obligatory Mobilities
   */
  async getAttachmentsObligatoryMobilities(): Promise<void> {
    this.loading = true;
    this.attachmentsObligatoryMobilitiesByHospital =
      await this.obligatoryMobilitiesService.getAllAttachments(
        this.filtersFormControl.controls.specialty.value!,
        this.filtersFormControl.controls.initialDate.value!,
        this.filtersFormControl.controls.finalDate.value!
      );
    this.loading = false;
  }

  /**
   * Checks that dates are valid and gets the data
   */
  initialDateChanged(): void {
    if (
      this.filtersFormControl.controls.initialDate.value!.getTime() >
      this.filtersFormControl.controls.finalDate.value!.getTime()
    ) {
      const date = this.filtersFormControl.controls.initialDate.value!;
      const index = this.intervals.finalMonths.findIndex((d) => {
        return (
          d.value.getTime() ==
          new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime()
        );
      });
      this.filtersFormControl.controls.finalDate.setValue(
        this.intervals.finalMonths[index].value
      );
    }
    this.getAttachmentsObligatoryMobilities();
  }

  /**
   * Checks that dates are valid and gets the data
   */
  finalDateChanged(): void {
    if (
      this.filtersFormControl.controls.finalDate.value!.getTime() <
      this.filtersFormControl.controls.initialDate.value!.getTime()
    ) {
      const date = this.filtersFormControl.controls.finalDate.value!;
      const index = this.intervals.initialMonths.findIndex((d) => {
        return (
          d.value.getTime() ==
          new Date(date.getFullYear(), date.getMonth(), 1).getTime()
        );
      });
      this.filtersFormControl.controls.initialDate.setValue(
        this.intervals.initialMonths[index].value
      );
    }
    this.getAttachmentsObligatoryMobilities();
  }

  /**
   * Gets the data when a filter change
   */
  async filtersChanged(): Promise<void> {
    if (this.filtersFormControl.valid) {
      await this.getAttachmentsObligatoryMobilities();
    }
  }

  /**
   * Converts a date type to string
   * @param date
   * @returns
   */
  initialDateToString(date: Date): string {
    return getFirstDayOfMonthAsString(new Date(date));
  }

  /**
   * Convert a date type to string
   * @param date
   * @returns
   */
  finalDateToString(date: Date): string {
    return getLastDayOfMonthAsString(new Date(date));
  }
}
