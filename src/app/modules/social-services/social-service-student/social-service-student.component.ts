import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { PATHS } from '@core/constants';
import { NameValueInterface } from '@core/interfaces';
import { Hospital, SocialService } from '@data/interfaces';
import { HospitalsService, SocialServicesService } from '@data/services';
import { SocialServiceDocumentTypes } from '@data/types/social-service-document.type';

/** Social Service Student component */
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
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    //Checks if the id at the url is valid
    this.route.params.subscribe(async (params) => {
      const _id = params['_id'];
      if (/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(_id)) {
        await this.getSocialService(_id);
      } else
        this.router.navigate([
          PATHS.ERROR.BASE_PATH,
          PATHS.ERROR.PAGE_NOT_FOUND,
        ]);
    });
  }

  /**
   * Gets a Social Service
   * @param _id
   */
  async getSocialService(_id = this.socialService!._id!): Promise<void> {
    this.loading = true;
    this.socialService = await this.socialServicesService.get(_id);
    if (this.socialService) {
      this.hospitals = await this.hospitalsService.getSocialServices();
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
      //Gets presentation office document
      if (this.socialService.presentationOfficeDocument) {
        this.presentationOfficeDocument =
          await this.socialServicesService.getDocument(
            this.socialService!._id!,
            'presentationOfficeDocument'
          );
      }
      //Gets report document
      if (this.socialService.reportDocument) {
        this.reportDocument = await this.socialServicesService.getDocument(
          this.socialService!._id!,
          'reportDocument'
        );
      }
      //Gets constancy document
      if (this.socialService.constancyDocument) {
        this.constancyDocument = await this.socialServicesService.getDocument(
          this.socialService!._id!,
          'constancyDocument'
        );
      }
      this.loading = false;
    } else
      this.router.navigate([PATHS.ERROR.BASE_PATH, PATHS.ERROR.PAGE_NOT_FOUND]);
  }

  /**
   * Updates a Social Service in the server
   */
  async updateSocialService(): Promise<void> {
    if (this.socialServiceFormControl.valid) {
      const values = this.socialServiceFormControl.value;
      this.loading = true;
      const data = await this.socialServicesService.update(
        this.socialService!._id!,
        {
          hospital: values.hospital!,
          period: values.period!,
          student: this.socialService?.student as string,
          year: +values.year!,
        }
      );
      if (data) {
        this.socialService = data;
        this.snackBar.open('Servicio Social editado', undefined, {
          duration: 2000,
          panelClass: 'accent-snackbar',
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
      }
      this.loading = false;
    }
  }

  /**
   * Deletes a Social Service in the server
   */
  async deleteSocialService(): Promise<void> {
    await this.socialServicesService.delete(this.socialService!._id!);
    this.router.navigate(['..']);
  }

  /**
   * Updates a Social Service document in the server
   * @param event
   * @param type document type
   */
  async updateFile(event: any, type: SocialServiceDocumentTypes) {
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

  /**
   * Deletes a Social Service document in the server
   * @param type
   */
  async deleteFile(type: SocialServiceDocumentTypes): Promise<void> {
    this.loading = true;
    await this.socialServicesService.deleteDocument(
      this.socialService!._id!,
      type
    );
    await this.getSocialService();
  }
}
