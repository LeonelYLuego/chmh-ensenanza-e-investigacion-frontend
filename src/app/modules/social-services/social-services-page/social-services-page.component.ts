import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PATHS } from '@core/constants';
import { NameValueInterface } from '@core/interfaces';
import { Hospital, SocialService, Student } from '@data/interfaces';
import { HospitalsService, SocialServicesService } from '@data/services';

/** Social Service page component */
@Component({
  selector: 'app-social-services-page',
  templateUrl: './social-services-page.component.html',
  styleUrls: ['./social-services-page.component.css'],
})
export class SocialServicesPageComponent implements OnInit {
  loading = false;
  paths = PATHS.SOCIAL_SERVICES;
  socialServices: {
    _id?: string;
    specialty?: string;
    student?: string;
    hospital?: string;
    period?: string;
    documents?: {
      presentationOffice?: string;
      report?: string;
      constancy?: string;
    };
  }[] = [];
  hospitals: Hospital[] = [];
  displayedColumns = ['student', 'hospital', 'period', 'documents'];
  initialPeriods: NameValueInterface<{ year: number; period: number }>[] = [];
  finalPeriods: NameValueInterface<{ year: number; period: number }>[] = [];
  periodFormControl = new FormGroup({
    initialPeriod: new FormControl<{
      year: number;
      period: number;
    } | null>(null, [Validators.required]),
    finalPeriod: new FormControl<{
      year: number;
      period: number;
    } | null>(null, [Validators.required]),
  });

  constructor(
    private socialServicesService: SocialServicesService,
    private hospitalsService: HospitalsService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    //Gets initial and final periods for filters
    const periods = await this.socialServicesService.getInitialFinalPeriods();
    this.initialPeriods = periods.map((p) => p.initial);
    this.finalPeriods = periods.map((p) => p.final);
    //Gets all Social Services Hospitals
    this.hospitals = await this.hospitalsService.getAll();
    //If the periods exist, selects the last year registered
    if (periods.length >= 3) {
      let initialPeriodIndex = -1;
      let finalPeriodIndex = -1;
      if (localStorage.getItem('socialServiceInitialPeriod')) {
        initialPeriodIndex = periods.findIndex(
          (period) =>
            JSON.stringify(period.initial.value) ==
            localStorage.getItem('socialServiceInitialPeriod')
        );
      }
      if (localStorage.getItem('socialServiceFinalPeriod')) {
        finalPeriodIndex = periods.findIndex((period) => {
          return (
            JSON.stringify(period.final.value) ==
            localStorage.getItem('socialServiceFinalPeriod')
          );
        });
      }
      this.periodFormControl.controls.initialPeriod.setValue(
        periods[
          initialPeriodIndex == -1 ? periods.length - 3 : initialPeriodIndex
        ].initial.value
      );
      this.periodFormControl.controls.finalPeriod.setValue(
        periods[finalPeriodIndex == -1 ? periods.length - 1 : finalPeriodIndex]
          .final.value
      );
    }
    //Gets all social services in the period
    if (periods.length > 0) {
      await this.getSocialServices();
    }
  }

  /**
   * Gets social services from the server
   */
  async getSocialServices() {
    this.loading = true;
    //Clears the social services array
    this.socialServices = [];
    const value = this.periodFormControl.value;
    //Gets social services from the server
    const ss = await this.socialServicesService.getAll(
      value.initialPeriod?.year!,
      value.initialPeriod?.period!,
      value.finalPeriod?.year!,
      value.finalPeriod?.period!
    );
    //Sorts the Social Services Array by specialty
    ss.sort((a, b) => a.value.localeCompare(b.value));
    ss.map((s) => {
      if (s.socialServices.length > 0) {
        //Adds a specialty to the Social Services array
        this.socialServices.push({
          specialty: s.value,
        });
        //Sorts the Social Services by Fist Last Name
        s.socialServices.sort((a, b) =>
          (a.student as Student).firstLastName.localeCompare(
            (b.student as Student).firstLastName
          )
        );
        s.socialServices.map((v) => {
          const student = v.student as Student;
          //Adds a Social Service to the Social Services Array
          this.socialServices.push({
            _id: v._id,
            student: `${student.name} ${student.firstLastName} ${
              student.secondLastName ?? ''
            }`,
            period: this.getPeriod(v.period, v.year),
            hospital: this.getHospital(v.hospital as string)!.name,
            documents: {
              presentationOffice: v.presentationOfficeDocument,
              report: v.reportDocument,
              constancy: v.constancyDocument,
            },
          });
        });
      }
    });
    this.loading = false;
  }

  /**
   * Validates if the period is valid
   * @returns `true` if valid, `false` if invalid
   */
  private validatePeriod(): boolean {
    const value = this.periodFormControl.value;
    const initial = value.initialPeriod!;
    const final = value.finalPeriod!;
    return (
      final.year < initial.year ||
      (final.year == initial.year && final.period < initial.period)
    );
  }

  /**
   * Checks if the final period is valid, if is invalid changes it
   */
  initialPeriodChange() {
    if (this.validatePeriod()) {
      const value = this.periodFormControl.value.initialPeriod!;
      const index = this.finalPeriods.findIndex((period) => {
        return (
          value.period == period.value.period && value.year == period.value.year
        );
      });
      this.periodFormControl.controls.finalPeriod.setValue(
        this.finalPeriods[index].value
      );
    }
    localStorage.setItem(
      'socialServiceInitialPeriod',
      JSON.stringify(this.periodFormControl.value.initialPeriod!)
    );
    this.getSocialServices();
  }

  /**
   * Checks if the initial period is valid, if is invalid changes it
   */
  finalPeriodChange() {
    if (this.validatePeriod()) {
      const value = this.periodFormControl.value.finalPeriod!;
      const index = this.initialPeriods.findIndex((period) => {
        return (
          value.period == period.value.period && value.year == period.value.year
        );
      });
      this.periodFormControl.controls.initialPeriod.setValue(
        this.initialPeriods[index].value
      );
    }
    localStorage.setItem(
      'socialServiceFinalPeriod',
      JSON.stringify(this.periodFormControl.value.finalPeriod!)
    );
    this.getSocialServices();
  }

  /**
   * Gets all Hospitals in the server
   * @param _id
   * @returns
   */
  getHospital(_id: string): Hospital | undefined {
    return this.hospitals.find((hospital) => hospital._id == _id);
  }

  /**
   * Gets period in format `Noviembre 2022 - Febrero 2023`
   * @param period
   * @param year
   * @returns the period as string
   */
  getPeriod(period: number, year: number) {
    return this.socialServicesService.getPeriod(period, year);
  }

  /**
   * Navigates to the specific Social Service
   * @param row
   */
  updateSocialService(row: SocialService) {
    if (row._id) this.router.navigate([this.paths.BASE_PATH, row._id!]);
  }
}
