import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NameValueInterface } from '@app/core/interfaces/name-value.interface';
import { Hospital } from '@app/data/interfaces/hospital';
import {
  SocialService,
  SocialServiceBySpecialty,
} from '@app/data/interfaces/social-service';
import { Student } from '@app/data/interfaces/student';
import { HospitalsService } from '@app/data/services/hospitals.service';
import { SocialServicesService } from '@app/data/services/social-services.service';

@Component({
  selector: 'app-social-services-page',
  templateUrl: './social-services-page.component.html',
  styleUrls: ['./social-services-page.component.css'],
})
export class SocialServicesPageComponent implements OnInit {
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
  displayedColumns = ['student', 'hospital', 'period'];
  periods: NameValueInterface<{ year: number; period: number }>[] = [];
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
    private hospitalsService: HospitalsService
  ) {}

  async ngOnInit(): Promise<void> {
    this.periods = await this.socialServicesService.getPeriods();
    this.hospitals = await this.hospitalsService.getHospitals();
    if (this.periods.length >= 3) {
      this.periodFormControl.controls.initialPeriod.setValue(
        this.periods[0].value
      );
      this.periodFormControl.controls.finalPeriod.setValue(
        this.periods[2].value
      );
    }
    await this.getSocialServices();
  }

  async getSocialServices() {
    const value = this.periodFormControl.value;
    const ss = await this.socialServicesService.getSocialServices(
      value.initialPeriod?.year!,
      value.initialPeriod?.period!,
      value.finalPeriod?.year!,
      value.finalPeriod?.period!
    );
    ss.map((s) => {
      if (s.socialServices.length > 0) {
        this.socialServices.push({
          specialty: s.value,
        });
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
    console.log(this.socialServices);
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
      this.periodFormControl.controls.finalPeriod.setValue(
        this.periodFormControl.value.initialPeriod!
      );
    }
  }

  finalPeriodChange() {
    if (this.validatePeriod()) {
      this.periodFormControl.controls.initialPeriod.setValue(
        this.periodFormControl.value.finalPeriod!
      );
    }
  }

  getHospital(_id: string): Hospital | undefined {
    return this.hospitals.find((hospital) => hospital._id == _id);
  }

  getPeriod(period: number, year: number) {
    return this.socialServicesService.getPeriod(period, year);
  }

  updateSocialService(row: SocialService) {
    console.log(row._id);
  }
}
