import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NameValueInterface } from '@app/core/interfaces/name-value.interface';
import { Hospital } from '@app/data/interfaces/hospital';
import { SocialService } from '@app/data/interfaces/social-service';
import { HospitalsService } from '@app/data/services/hospitals.service';
import { SocialServicesService } from '@app/data/services/social-services.service';

@Component({
  selector: 'app-social-service-student',
  templateUrl: './social-service-student.component.html',
  styleUrls: ['./social-service-student.component.css'],
})
export class SocialServiceStudentComponent implements OnInit {
  socialService: SocialService | null = null;
  socialServiceFormControl = new FormGroup({
    hospital: new FormControl<string | null>(null, [Validators.required]),
    period: new FormControl<0 | 1 | 2 | null>(null, [Validators.required]),
    year: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1990),
      Validators.max(2100),
    ]),
  });
  presentationOfficeDocument: SafeResourceUrl | null = null;
  reportDocument: SafeResourceUrl | null = null;
  constancyDocument: SafeResourceUrl | null = null;
  hospitals: Hospital[] = [];
  singlePeriods: NameValueInterface<number>[] = [];
  loading = true;

  constructor(
    private socialServicesService: SocialServicesService,
    private hospitalsService: HospitalsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      const _id = params['_id'];
      if (/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(_id)) {
        await this.getSocialService(_id);
      } else this.router.navigate(['/404']);
    });
  }

  async getSocialService(_id = this.socialService!._id!) {
    this.loading = true;
    this.socialService = await this.socialServicesService.getSocialService(_id);
    if (this.socialService) {
      this.hospitals = await this.hospitalsService.getSocialServiceHospitals();
      this.singlePeriods = this.socialServicesService.getSinglePeriods();
      this.socialServiceFormControl.setValue({
        hospital: this.socialService.hospital as string,
        period: this.socialService.period,
        year: this.socialService.year,
      });
      this.presentationOfficeDocument =
        this.reportDocument =
        this.constancyDocument =
          null;
      if (this.socialService.presentationOfficeDocument) {
        this.presentationOfficeDocument =
          await this.socialServicesService.getDocument(
            this.socialService!._id!,
            'presentationOfficeDocument'
          );
      }
      if (this.socialService.reportDocument) {
        this.reportDocument = await this.socialServicesService.getDocument(
          this.socialService!._id!,
          'reportDocument'
        );
      }
      if (this.socialService.constancyDocument) {
        this.constancyDocument = await this.socialServicesService.getDocument(
          this.socialService!._id!,
          'constancyDocument'
        );
      }
      this.loading = false;
    } else this.router.navigate(['/404']);
  }

  async updateSocialService() {
    if (this.socialServiceFormControl.valid) {
      const values = this.socialServiceFormControl.value;
      this.loading = true;
      const data = await this.socialServicesService.updateSocialService(
        this.socialService!._id!,
        {
          hospital: values.hospital!,
          period: values.period!,
          student: this.socialService?.student as string,
          year: +values.year!,
        }
      );
      if (data) this.socialService = data;
      this.loading = false;
    }
  }

  async deleteSocialService() {
    await this.socialServicesService.deleteSocialService(
      this.socialService!._id!
    );
    this.router.navigate(['..']);
  }

  async updateFile(
    event: any,
    type: 'presentationOfficeDocument' | 'reportDocument' | 'constancyDocument'
  ) {
    this.loading = true;
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      await this.socialServicesService.updateDocument(
        this.socialService!._id!,
        type,
        formData
      );
      await this.getSocialService();
    }
  }

  async deleteFile(
    type: 'presentationOfficeDocument' | 'reportDocument' | 'constancyDocument'
  ) {
    this.loading = true;
    await this.socialServicesService.deleteDocument(
      this.socialService!._id!,
      type
    );
    await this.getSocialService();
  }
}
