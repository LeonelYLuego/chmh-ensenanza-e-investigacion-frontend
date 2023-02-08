import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PATHS } from '@core/constants';
import {
  getFirstDayOfMonthAsString,
  getLastDayOfMonthAsString,
} from '@core/functions/date.function';
import {
  ObligatoryMobility,
  ObligatoryMobilityByHospital,
  ObligatoryMobilityByStudent,
  ObligatoryMobilityInterval,
  Specialty,
} from '@data/interfaces';
import {
  ObligatoryMobilitiesService,
  SpecialtiesService,
} from '@data/services';

/** Obligatory Mobilities page component */
@Component({
  selector: 'app-obligatory-mobilities-page',
  templateUrl: './obligatory-mobilities-page.component.html',
  styleUrls: ['./obligatory-mobilities-page.component.css'],
})
export class ObligatoryMobilitiesPageComponent implements OnInit {
  loading = false;
  paths = PATHS.OBLIGATORY_MOBILITIES;
  specialties: Specialty[] = [];
  intervals: ObligatoryMobilityInterval = {
    finalMonths: [],
    initialMonths: [],
  };
  intervalFormControl = new FormGroup({
    view: new FormControl<'hospital' | 'student'>('hospital', [
      Validators.required,
    ]),
    initialDate: new FormControl<Date | undefined>(undefined, [
      Validators.required,
    ]),
    finalDate: new FormControl<Date | undefined>(undefined, [
      Validators.required,
    ]),
    specialty: new FormControl<string>('', [Validators.required]),
  });
  obligatoryMobilitiesByHospital: ObligatoryMobilityByHospital[] = [];
  obligatoryMobilitiesByStudent: ObligatoryMobilityByStudent[] = [];
  displayedColumnsByHospital = [
    'student',
    'initialDate',
    'finalDate',
    'rotationService',
    'documents',
  ];
  displayedColumnsByStudent = [
    'hospital',
    'initialDate',
    'finalDate',
    'rotationService',
    'documents',
  ];

  constructor(
    private obligatoryMobilitiesService: ObligatoryMobilitiesService,
    private specialtiesService: SpecialtiesService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.intervals = await this.obligatoryMobilitiesService.interval();
    this.specialties = await this.specialtiesService.findAll();
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
  }

  /**
   * Gets the Obligatory Mobilities
   */
  async getObligatoryMobilities(): Promise<void> {
    if (this.intervalFormControl.valid) {
      this.loading = true;
      const values = this.intervalFormControl.value;
      if (this.intervalFormControl.controls.view.value! == 'hospital') {
        this.obligatoryMobilitiesByHospital =
          await this.obligatoryMobilitiesService.getAllByHospital(
            values.specialty!,
            values.initialDate!,
            values.finalDate!
          );
      } else {
        this.obligatoryMobilitiesByStudent =
          await this.obligatoryMobilitiesService.getAllByStudent(
            values.specialty!,
            values.initialDate!,
            values.finalDate!
          );
      }
      this.loading = false;
    }
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
   * Calls to get again the Attachments Obligatory Mobilities
   * when the vie changed
   */
  viewChanged(): void {
    this.getObligatoryMobilities();
  }

  /**
   * Gets the Attachments Obligatory Mobilities when the
   * specialty changed
   */
  specialtyChanged(): void {
    this.getObligatoryMobilities();
  }

  /**
   * Checks that dates are valid and gets de data
   */
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

  /**
   * Checks that dates are valid and gets de data
   */
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

  /** Redirects to Update Attachments Obligatory Mobility page */
  updateObligatoryMobility(obligatoryMobility: ObligatoryMobility): void {
    this.router.navigate([this.paths.BASE_PATH, obligatoryMobility._id!]);
  }
}
