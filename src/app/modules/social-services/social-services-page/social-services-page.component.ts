import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PATHS } from '@app/core/constants/paths.constant';
import { NameValueInterface } from '@app/core/interfaces/name-value.interface';
import { Hospital } from '@app/data/interfaces/hospital';
import { SocialService } from '@app/data/interfaces/social-service';
import { Student } from '@app/data/interfaces/student';
import { HospitalsService } from '@app/data/services/hospitals.service';
import { SocialServicesService } from '@app/data/services/social-services.service';

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
    } | null>(null),
    finalPeriod: new FormControl<{
      year: number;
      period: number;
    } | null>(null),
  });

  constructor(
    private socialServicesService: SocialServicesService,
    private hospitalsService: HospitalsService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    const periods = await this.socialServicesService.getInitialFinalPeriods();
    this.initialPeriods = periods.map((p) => p.initial);
    this.finalPeriods = periods.map((p) => p.final);
    this.hospitals = await this.hospitalsService.getHospitals();
    if (periods.length >= 3) {
      this.periodFormControl.controls.initialPeriod.setValue(
        periods[periods.length - 3].initial.value
      );
      this.periodFormControl.controls.finalPeriod.setValue(
        periods[periods.length - 1].final.value
      );
    }
    if (periods) {
      await this.getSocialServices();
    }
    this.loading = false;
  }

  async getSocialServices() {
    this.loading = true;
    this.socialServices = [];
    const value = this.periodFormControl.value;
    const ss = await this.socialServicesService.getSocialServices(
      value.initialPeriod?.year!,
      value.initialPeriod?.period!,
      value.finalPeriod?.year!,
      value.finalPeriod?.period!
    );
    ss.sort((a, b) => a.value.localeCompare(b.value));
    ss.map((s) => {
      if (s.socialServices.length > 0) {
        this.socialServices.push({
          specialty: s.value,
        });
        s.socialServices.sort((a, b) =>
          (a.student as Student).firstLastName.localeCompare(
            (b.student as Student).firstLastName
          )
        );
        s.socialServices.map((v) => {
          const student = v.student as Student;
          this.socialServices.push({
            _id: v._id,
            student: `${student.name} ${student.firstLastName} ${student.secondLastName}`,
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

  private validatePeriod(): boolean {
    const value = this.periodFormControl.value;
    const initial = value.initialPeriod!;
    const final = value.finalPeriod!;
    return (
      final.year < initial.year ||
      (final.year == initial.year && final.period < initial.period)
    );
  }

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
    this.getSocialServices();
  }

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
    this.getSocialServices();
  }

  getHospital(_id: string): Hospital | undefined {
    return this.hospitals.find((hospital) => hospital._id == _id);
  }

  getPeriod(period: number, year: number) {
    return this.socialServicesService.getPeriod(period, year);
  }

  updateSocialService(row: SocialService) {
    this.router.navigate(['social-services', row._id!]);
  }
}
